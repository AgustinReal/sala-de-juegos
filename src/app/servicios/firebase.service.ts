import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private auth:AngularFireAuth, private fireStoreBD:AngularFirestore, private storage: AngularFireStorage) {
    
   }

   IniciarSesionCorreoClave(email: string, clave: string):Promise<any>
   {
    return this.auth.signInWithEmailAndPassword(email, clave);
   }

   AgregarElementoFireBase(id: number, email: string, clave: string, tipo: string)
   {
     return this.fireStoreBD.collection("Usuarios").add
     ({
      id: id,
      email: email,
      clave: clave,
      tipo: tipo
     });
   }

   async checkIfUserExists(email: string): Promise<boolean> {
    try {
      const methods = await this.auth.fetchSignInMethodsForEmail(email);
      return methods.length > 0;
    } catch (error) {
      console.error('Error verificando si el usuario existe:', error);
      return false;
    }
  }

  ///storage -> manejo de archivos
  async uploadFiles(input: HTMLInputElement, fileCategory: string, usuario: string) {
    if (!input.files) return;
    const fotosPerfilRefCollection = this.fireStoreBD.collection('fotosPerfil');
    const files: FileList = input.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        const fileId = uuidv4();
        const filePath = 'fotos/' + fileId + file.name;
        const taskStorage = this.storage.upload(filePath, file);
        const snapshot = await taskStorage;
        const downloadURL = await snapshot.ref.getDownloadURL();

        const photoRefDoc = {
          usuario: usuario,
          downloadURL: downloadURL,
          fecha: new Date().toLocaleString('es-AR'),
          tipo: fileCategory
        };
        await fotosPerfilRefCollection.add(photoRefDoc);
      }
    }
  }

  async getDownloadURLFromCollectionPerfil(usuario: string): Promise<string | null> {
    const fotosPerfilRefCollection = this.fireStoreBD.collection('fotos');

    try {
      const q = this.fireStoreBD.collection('fotosPerfil', ref => ref.where('usuario', '==', usuario));
      return q.get().toPromise()
      .then((querySnapshot: any) => {
      if (querySnapshot.size === 1) {
        const docData = querySnapshot.docs[0].data();
        return docData.downloadURL || null;
      }
    });
    } 
     catch (error) {
      console.error('Error fetching document:', error);
    }

    return null;
  }

  ///fireStoreBD -> manejo de base de datos no relacional
  ///alta
 
  
  public async createUser(user: any, email: string, password: string) {
    try {
      const usuarioNuevo = await this.auth.createUserWithEmailAndPassword(email, password);
      const newId = usuarioNuevo.user?.uid;
      if (!newId) {
        throw new Error("User ID not found after creating a new user");
      }
      user={
      ...user,
      _id:newId
      };
      const docRef = await  this.fireStoreBD.collection('usuario').add(user);
      await docRef;

    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }


  registro(_id: string, tipo: string) {
    let objetoJSData = { _id: _id, tipo: tipo };
    return this.fireStoreBD.collection("usuarios").add(objetoJSData);
  }

  //modificacion

  //lectura
  lecturaATravesDeId(_id: string) {
    const collectionRef = this.fireStoreBD.collection("usuarios", (ref) => {
      return ref.where("_id", "==", _id).limit(1);
    }
    ).get();
    return collectionRef;
  }

  lecturaATravesDeTipo(tipo: string) {
    const collectionRef = this.fireStoreBD.collection('usuarios', (ref) => {
      return ref.where('tipo', '==', tipo);
    }).get();

    return collectionRef;
  }

  lecturaTodos() {
    const collectionRef = this.fireStoreBD.collection('usuarios').get();

    return collectionRef;
  }

  lecturaTodosDetectaCambios(){
    return this.fireStoreBD.collection('usuarios').valueChanges();
  }

  //baja
  bajaPorId(id: string) {
    // Obtiene la referencia al documento específico por su ID
    const documentRef = this.fireStoreBD.collection('usuarios').doc(id);

    // Llama al método delete() para eliminar el documento
    return documentRef.delete();
  }

  eliminarPorAtributoInterno(atributo: string, valor: any): Promise<void> {
    // Realiza una consulta para encontrar el documento con el atributo y valor específico
    const query = this.fireStoreBD.collection('usuarios', ref => ref.where(atributo, '==', valor).limit(1));

    // Ejecuta la consulta para obtener el primer documento que coincide con el atributo y valor
    return query.get().toPromise()
      .then((querySnapshot: any) => {
        if (!querySnapshot.empty) {
          // Obtiene el ID del documento encontrado
          const docId = querySnapshot.docs[0].id;

          // Obtiene la referencia al documento específico por su ID
          const documentRef = this.fireStoreBD.collection('usuarios').doc(docId);

          // Llama al método delete() para eliminar el documento
          return documentRef.delete();
        } else {
          // Si no se encontró ningún documento con el atributo y valor específico, muestra un mensaje o realiza alguna acción
          console.log('No se encontró ningún documento con el atributo y valor especificado.');
          return Promise.reject();
        }
      })
      .catch((error) => {
        console.error('Error al eliminar el documento:', error);
        return Promise.reject(error);
      });
  }

  modificarPorAtributoInterno(_id: string, atributo: string, valor: string): Promise<void> {
    const query = this.fireStoreBD.collection("usuarios", ref => ref.where("_id", "==", _id).limit(1));

    // Ejecuta la consulta para obtener el primer documento que coincide con el atributo y valor
    return query.get().toPromise()
      .then((querySnapshot: any) => {
        if (!querySnapshot.empty) {
          // Obtiene el ID del documento encontrado
          const docId = querySnapshot.docs[0].id;

          // Obtiene la referencia al documento específico por su ID
          const documentRef = this.fireStoreBD.collection('usuarios').doc(docId);

          let data = {
            ...querySnapshot.docs[0].data,
            [atributo]:valor
          }

          return documentRef.update(data);
        } else {
          // Si no se encontró ningún documento con el atributo y valor específico, muestra un mensaje o realiza alguna acción
          console.log('No se encontró ningún documento con el atributo y valor especificado.');
          return Promise.reject();
        }
      })
      .catch((error) => {
        console.error('Error al modificar el documento:', error);
        return Promise.reject(error);
      });
  }

}


