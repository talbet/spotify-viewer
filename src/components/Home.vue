<template>
   <div class="col-sm-12">
     <h1>Homepage</h1>
     <hello></hello>
   </div>
 </template>

 <script>
 import Hello from './Hello.vue'
 export default {
   data() {
     return {
       quote: ''
     }
   },
   components: {
     Hello,
   },
   methods: {
   }
 }
 </script>
