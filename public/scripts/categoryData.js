const categoryList = [
{'id' : 1 , 'name' : '家居物業' , 'selected' : '' ,
  'icon' : `<i class="fa-solid fa-house fa-2xl"></i>` },
{'id' : 2 , 'name' : '交通出行' , 'selected' : '' ,
  'icon' : `<i class="fa-solid fa-van-shuttle fa-2xl"></i>` },
{'id' : 3 , 'name' : '休閒娛樂' , 'selected' : '' , 
  'icon' : `<i class="fa-solid fa-face-grin-beam fa-2xl"></i>` },
{'id' : 4 , 'name' : '餐飲食品' , 'selected' : '' ,
  'icon' : `<i class="fa-solid fa-utensils fa-2xl"></i>` },
{'id' : 5 , 'name' :'其他' , 'selected' : '' ,
  'icon' : `<i class="fa-solid fa-pen fa-2xl"></i>` }
];

let currentCategory = 0;

module.exports = {categoryList , currentCategory};