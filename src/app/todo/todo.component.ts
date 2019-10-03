import { Component, OnInit } from '@angular/core';
import { TodoService } from './shared/todo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  providers : [TodoService]
})
export class TodoComponent implements OnInit {
  toDoListArray : any[];
  constructor(private todoService : TodoService) { }

  ngOnInit() {
    //convert firelist to regular list toDoListArray
    //we subscribe so that whenever a change happens in firebase array gets updated
    this.todoService.getToDoList().snapshotChanges()
    .subscribe(item => {
      this.toDoListArray = [];
      item.forEach(element => {
        var x = element.payload.toJSON();
        x["$key"] = element.key;
        this.toDoListArray.push(x);
      })

      //sort array from false to true (isChecked property)
      this.toDoListArray.sort((a,b) => {
        return a.isChecked - b.isChecked;
      })
    });
  }

  onAdd(itemTitle) {
    //we add the item into firebase then reset input box
    this.todoService.addTitle(itemTitle.value);
    itemTitle.value = null;
  }

  alterCheck($key: string, isChecked) {
    this.todoService.checkOrUncheckTitle($key, !isChecked);
  }

  onDelete($key: string) {
    this.todoService.removeTitle($key);
  }

}
