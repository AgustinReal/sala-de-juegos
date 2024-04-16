import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-quien',
  templateUrl: './quien.component.html',
  styleUrls: ['./quien.component.css']
})
export class QuienComponent implements OnInit {

  public jsonApi: any;

  constructor(private http: HttpClient)
  {
    
  }

  ngOnInit(): void {
    this.http.get('https://api.github.com/users/AgustinReal').subscribe(dataApi => 
    {this.jsonApi = dataApi; console.log(this.jsonApi);}
    );
  }

}
