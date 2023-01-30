var randMeal
var mealArray = []
for(i=0 ; i < 6 ; i++){
$.ajax({
    url:'https://www.themealdb.com/api/json/v1/1/random.php',
    type:'GET',
    async: false,
    success:function(data){
        randMeal = data.meals[0]
        mealArray.push(randMeal)
    }
})
}
jQuery.ajax({ 
    url: 'https://themealdb.com/api/json/v1/1/list.php?c=list', 
    type:'GET',
    async: false,
    success:function(data){
        selectBox('#category',data.meals,'strCategory')
    }
    });
jQuery.ajax({ 
    url: 'https://themealdb.com/api/json/v1/1/list.php?a=list', 
    type:'GET',
    async: false,
    success:function(data){
        selectBox('#region',data.meals,'strArea')
    }
    });
    
cardInsert(mealArray)

function cardInsert(data){
    let cards = document.getElementById('cards')
    let addCard
    for(i=0; i < data.length; i++){
        addCard = `<div class="card" style="width: 25%;">
        <img src="${data[i].strMealThumb}" class="card-img-top" alt="...">
        <ul class="list-group list-group-flush">
        <li class="list-group-item">${data[i].strMeal}</li>
        </ul>
        <div class="card-body">
        <a href="#" onclick="showModal(${data[i].idMeal})" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#dataModal">Plus de détails</a>
        </div>
        </div> `
        cards.innerHTML += addCard
}
}
function cardInsert2(data){
    let cards2 = document.getElementById('cards2')
    cards2.innerHTML = ''
    let addCard
    for(i=0; i < data.length; i++){
        addCard = `<div class="card" style="width: 25%;">
        <img src="${data[i].strMealThumb}" class="card-img-top" alt="...">
        <ul class="list-group list-group-flush">
        <li class="list-group-item">${data[i].strMeal}</li>
        </ul>
        <div class="card-body">
        <a href="#" onclick="showModal(${data[i].idMeal})" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#dataModal">Plus de détails</a>
        </div>
        </div> `
        cards2.innerHTML += addCard
}}
function showModal(id){
    let detailArray = []
    $.ajax({
        url:'https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id,
        type:'GET',
        async: false,
        success:function(data){
            detailArray = data.meals[0]
        }
    })
    document.getElementById('detailName').innerHTML = detailArray.strMeal
    document.getElementById('detailImg').src = detailArray.strMealThumb
    document.getElementById('detailVid').src = detailArray.strYoutube.replace('https://www.youtube.com/watch?v=','https://www.youtube.com/embed/')
    document.getElementById('detailInstruction').innerHTML = detailArray.strInstructions
    document.getElementById('detailArea').innerHTML = detailArray.strArea
    document.getElementById('detailCategory').innerHTML = detailArray.strCategory
    document.getElementById('detailTags').innerHTML = detailArray.strTags
    let ingredients
    ingredients = ''
    let measures
    measures = ''
    for (let i = 1; i <= 20; i++) {
        if(detailArray['strIngredient'+i] != null && detailArray['strIngredient'+i] != " " && detailArray['strIngredient'+i].length >0)
        ingredients += ` <li  > ${detailArray['strIngredient'+i]} </li> `;
        if(detailArray['strMeasure'+i] != null && detailArray['strMeasure'+i] != " " && detailArray['strMeasure'+i].length >0)
        measures += ` <li  > ${detailArray['strMeasure'+i]} </li> `;
    }
    document.getElementById('detailIngredients').innerHTML = ingredients
    document.getElementById('detailMeasures').innerHTML = measures

}
function searchMeal(inputData){
    var mealFound = [];
    jQuery.ajax({ 
        url: 'https://themealdb.com/api/json/v1/1/search.php?s='+inputData, 
        type:'GET',
        async: false,
        success:function(data){
    
            mealFound = data.meals;

        }
    });
    return mealFound ;
}
function searchGo(){
    let searchText = document.querySelector('#searchInp').value
    let cards = document.getElementById('cards')
    cards.innerHTML = ''
    const mealFound = searchMeal(searchText)
    cardInsert(mealFound)
}
function selectBox(id, array, boxType){
    selectBoxID = document.querySelector(`${id}`)
    for (let i = 0; i < array.length; i++) {
        if(array[i][`${boxType}`] === 'Moroccan')
        selectBoxID.innerHTML += `<option value="${array[i][`${boxType}`]}" selected>${array[i][`${boxType}`]}</option>`
        else if(array[i][`${boxType}`] === 'Beef')
        selectBoxID.innerHTML += `<option value="${array[i][`${boxType}`]}" selected>${array[i][`${boxType}`]}</option>`
        else
        selectBoxID.innerHTML += `<option value="${array[i][`${boxType}`]}">${array[i][`${boxType}`]}</option>`
    }
}
function sortBy(){
    document.querySelector('#notFound').innerHTML = ''
    category = document.querySelector('#category').value
    region = document.querySelector('#region').value
    let categoryList = []
    let regionList = []
    let filteredList = []
    jQuery.ajax({ 
        url: `https://themealdb.com/api/json/v1/1/filter.php?c=${category}`, 
        type:'GET',
        async: false,
        success:function(data){
            categoryList = data.meals
        }
    });
    if(category === 'All' && region === 'All'){
        let fullCatList = []
        jQuery.ajax({ 
            url: `https://themealdb.com/api/json/v1/1/list.php?c=list`, 
            type:'GET',
            async: false,
            success:function(data){
                fullCatList = data.meals
                console.log(fullCatList)
            }
        });
        let fullMeals = []
        for(i=0 ; i<fullCatList.length;i++){
            jQuery.ajax({ 
                url: `https://themealdb.com/api/json/v1/1/filter.php?c=${fullCatList[i].strCategory}`, 
                type:'GET',
                async: false,
                success:function(data){
                    fullMeals.push(data.meals)
                }
            });
        }
        cardInsert2(fullMeals.flat(1))
    }
    if(category !== 'All' && region === 'All'){
        jQuery.ajax({ 
            url: `https://themealdb.com/api/json/v1/1/filter.php?c=${category}`, 
            type:'GET',
            async: false,
            success:function(data){
                categoryList = data.meals
            }
        });
        let regionAll = []
        for (let i = 0; i < categoryList.length; i++) {
            regionAll.push(categoryList[i])
        }
        cardInsert2(regionAll)
    }
    if(category === 'All' && region !== 'All'){
        jQuery.ajax({ 
            url: `https://themealdb.com/api/json/v1/1/filter.php?a=${region}`, 
            type:'GET',
            async: false,
            success:function(data){
                regionList = data.meals
            }
        });
        let categoryAll = []
        for (let i = 0; i < regionList.length; i++) {
            categoryAll.push(regionList[i])
        }
        cardInsert2(categoryAll)
    }
    jQuery.ajax({ 
        url: `https://themealdb.com/api/json/v1/1/filter.php?a=${region}`, 
        type:'GET',
        async: false,
        success:function(data){
            regionList = data.meals
        }
    });
    for (let i = 0; i < categoryList.length; i++) {
        for (let j = 0; j < regionList.length; j++) {
            if(+regionList[j].idMeal == +categoryList[i].idMeal)
                filteredList.push(regionList[j])
        }
    }
    cardInsert2(filteredList)
    if(filteredList.length === 0)
    document.querySelector('#notFound').innerHTML = 'Meal not found!'
}