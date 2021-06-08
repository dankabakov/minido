
// Get previous Data
const taskList = [];
const toDoList = {
  listName: "Snoop Dogg",
  tasks: [
    {"name": "Clean Room", "done": false},
    {"name": "Buy Food", "done": false},
    {"name": "Do Code", "done": false}
  ]
}

console.log(toDoList.listName);
$("#titleInput").val(toDoList.listName);

chrome.storage.sync.get(["list", "toDoListBackup"], function(task) {
$("#titleInput").val(task.toDoListBackup.listName);
console.log(toDoListBackup);
$.each(task.list, function(index, value) { 
  // taskList.push(value);
});

/* Function: Recreate tasks from tasksList */
$.each(taskList, function(index, value) { 
  $(".item").append(
    `<div class="itemInner">
      <i class="emptybox material-icons">check_box_outline_blank</i>
      <p>${value}</p>
      <button class="removeItemBtn">
      <i class="deleteIcon material-icons">delete</i>
      </button>
     </div>`)
  });
});

/* Function: Submit on Enter */
$("#addNewItemInput").on("keydown", (e) => {
if (e.keyCode === 13) {
  $("#addNewItemBtn").click();
  $("#addNewItemInput").val("");
}
})

$("#titleInput").on("keydown", (e) => {
if (e.keyCode == 13) {
  $("#titleInput").blur();
  toDoList.listName = titleInput.value;
  chrome.storage.sync.set({ "toDoListBackup": toDoList});
}
})




/* Function: Add a new item */
$("#addNewItemBtn").on("click", () => {
if ($("#addNewItemInput").val() == "") {
  gsap.to("#addNewItemInput", .1, {x: -4});
  gsap.to("#addNewItemInput", .1, {delay: .1, x: 4});
  gsap.to("#addNewItemInput", .1, {delay: .2, x: -4});
  gsap.to("#addNewItemInput", .1, {delay: .3, x: 4});
  gsap.to("#addNewItemInput", .1, {delay: .4, x: 0});
} else {
  const newItemInput = $("#addNewItemInput").val()
  taskList.push(newItemInput);
  chrome.storage.sync.set({"list": taskList});
$(".item").append(
  `<div class="itemInner">
    <i class="emptybox material-icons">check_box_outline_blank</i>
    <p>${newItemInput}</p>
    <button class="removeItemBtn">
    <i class="deleteIcon material-icons">delete</i>
    </button>
   </div>`)
$("#addNewItemInput").val("")
gsap.to(".itemsWrapper, .item", .3, {paddingBottom: 30, ease: Back.easeOut});
gsap.to(".itemsWrapper, .item", .3, {delay: .15, paddingBottom: 8, y: 0, ease: Back.easeOut});
}
})


/* Function: Completed item */
$(".item").on("click", ".material-icons", (e) => {
const clickedText = e.target.parentElement.getElementsByTagName("p");
const clickedIcon = e.target.parentElement.getElementsByTagName("i");

if ($(clickedIcon).hasClass("emptybox")) {
const emptyIconBox = e.target.parentElement.getElementsByClassName("emptybox");
$(emptyIconBox).text("check_box");
$(emptyIconBox).addClass("fullbox");
$(emptyIconBox).removeClass("emptybox");
$(clickedText).css({"text-decoration": "line-through"});

} else if ($(clickedIcon).hasClass("fullbox")) {
const fullIconBox = e.target.parentElement.getElementsByClassName("fullbox");
$(fullIconBox).text("check_box_outline_blank");
$(fullIconBox).addClass("emptybox");
$(fullIconBox).removeClass("fullbox");
$(clickedText).css({"text-decoration": "none"});
}
})

/* Function: Remove item */
$(".item").on("click", "button.removeItemBtn", (e) => {
  const deleteParagraph = e.target.parentElement.getElementsByTagName("p");
  const deleteText = $(deleteParagraph).text();
  $(e.target.parentElement).remove();

  console.log("Task to Delete: " + deleteText);
  for( var i = 0; i < taskList.length; i++){ 
    console.log(taskList[i]);
    if ( taskList[i] === deleteText) { 
      taskList.splice(i, 1); 
    }
  }
  chrome.storage.sync.set({"list": taskList});

gsap.to(".itemsWrapper, .item", 0, {paddingBottom: 52})
gsap.to(".itemsWrapper, .item", .3, {paddingBottom: 8, ease: Back.easeOut})
})

/* Animation: Edit list title animation */
gsap.set("#pencilicon", {opacity: 0, rotate: -180, transformOrigin: "center"})
gsap.set("#titleInput, #addNewItemInput", {border: "1px solid transparent", boxShadow: "0 0 0 rgba(211, 220, 248, .3)"})

$("#titleInput").on("mouseenter", () => {
  gsap.to("#pencilicon", .3, {rotate: 0, opacity: 1, transformOrigin: "center", ease: Back.easeOut})
})

$("#titleInput").on("mouseleave", () => {
if ($("#titleInput").is(":focus")) {
  gsap.to("#pencilicon", .3, {rotate: 0, opacity: 1, transformOrigin: "center", ease: Back.easeOut})
} else if (!($("#titleInput").is(":focus"))) {
  gsap.to("#pencilicon", .3, {rotate: -180, opacity: 0, transformOrigin: "center", ease: Back.easeOut})
}
})

$("#titleInput").on("focus", () => {
gsap.to("#pencilicon", .3, {rotate: 0, opacity: 1, transformOrigin: "center", ease: Back.easeOut})
gsap.to("#titleInput", .3, {border: "1px solid #e7ecfb", boxShadow: "0 0 12px rgba(211, 220, 248, .3)"})
})

$("#titleInput").on("focusout", () => {
gsap.to("#pencilicon", .3, {rotate: -180, opacity: 0, transformOrigin: "center", ease: Back.easeOut})
gsap.to("#titleInput", .3, {border: "1px solid transparent", boxShadow: "0 0 12px rgba(211, 220, 248, 0)"})
})

/* Animation: Trash fade on item hover */
$(".item").on("mouseenter", ".itemInner", (e) => {
const trashBtn = $(e.target.querySelector(".removeItemBtn"))
gsap.to(trashBtn, .3, {opacity: 1})
})

$(".itemInner").on("mouseenter", ".removeItemBtn", (e) => {
const trashBtn = e.target
gsap.to(trashBtn, .3, {opacity: 1})
})

$(".innerItem").on("mouseleave", ".removeItemBtn", (e) => {
gsap.to(trashBtn, .3, {opacity: 0})
})

$(".item").on("mouseleave", ".itemInner", (e) => {
const trashBtn = $(e.target.querySelector(".removeItemBtn"))
gsap.to(trashBtn, .3, {opacity: 0})
})

$(".itemInner").on("mouseleave", ".removeItemBtn", (e) => {
const trashBtn = e.target
gsap.to(trashBtn, .3, {opacity: 0})
})

/* Animation: Add a new item  */
$("#addNewItemInput").on("focus", () => {
gsap.to("#addNewItemInput", .3, {border: "1px solid #e7ecfb", boxShadow: "0 0 12px rgba(211, 220, 248, .3)"})
})

$("#addNewItemInput").on("focusout", () => {
gsap.to("#addNewItemInput", .3, {border: "1px solid transparent", boxShadow: "0 0 12px rgba(211, 220, 248, 0)"})
})

$("#addNewItemBtn").on("mouseenter", () => {
gsap.to("#addicon", .3, {rotate: 90, ease: Back.easeOut})
})

$("#addNewItemBtn").on("mouseleave", () => {
gsap.to("#addicon", .3, {rotate: 0, ease: Back.easeOut})
})