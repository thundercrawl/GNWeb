<template>
<div class="input-group"> 
  <input v-model="newItem" v-on:keyup.enter="addItem"      
    placeholder="add shopping list item" type="text" class="form-      
    control"> 
  <span class="input-group-btn"> 
    <button v-on:click="addItem" class="btn btn-default"            
      type="button">Add!</button> 
  </span> 
</div>
</template>