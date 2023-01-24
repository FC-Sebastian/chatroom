const form = $("#form");
const create = $("#create");
const join = $("#join");

$(document).ready(function () {
   create.click(function (){
       createClick();
   });
   join.click(function (){
       joinClick();
   });
});

function createClick() {
    form.attr("action","http://localhost/chatroom/create");
}

function joinClick() {
    form.attr("action","http://localhost/chatroom/join");
}