// Nombre de cartes dans la page
const cardNum = 6

let paginationArray = []

// Appel des APIs pour remplir les select box
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

// Fonctions de la Home page

// Recettes aléatoires
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
// Inserer les 6 recettes aléatoires 
cardInsert(mealArray)

// Fonction d'insertion
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
// Fonction de recherche
function searchMeal(inputData){
    var mealFound = [];
    jQuery.ajax({ 
        url: 'https://themealdb.com/api/json/v1/1/search.php?s='+inputData, 
        type:'GET',
        async: false,
        success:function(data){
            mealFound = data.meals;
            paginationArray = mealFound
        }
    });
    return mealFound ;
}
// Fonction onclick qui insert les recettes recherchées
function searchGo(){
    document.querySelector('#pagination').innerHTML = ''
    let searchText = document.querySelector('#searchInp').value
    let cards = document.getElementById('cards')
    cards.innerHTML = ''
    mealFound = searchMeal(searchText)
    paginate(mealFound)
}
// Fonction qui insert les touches de pagination
function pages1(pageNum){
    let pagination = document.querySelector('#pagination')
    let pages = ''
    for (let i = 1; i <= pageNum; i++) {
        pages += `<li class="page-item pe-auto"><a class="page-link pe-auto" onclick="pageClick(${i})">${i}</a></li>`
    }
    pagination.innerHTML = pages
}
// Fonction de pagination
function paginate(array, pageID=1){
    // On divise la liste des recettes par 6
    let pageNum = array.length/cardNum
    // 2 variables qui sginifient le point de commencement et le point d'arret
    let endIndex = pageID*cardNum
    let startIndex = endIndex-cardNum
    let arrayPart = []
    let cards = document.getElementById('cards')
    cards.innerHTML = ''
    for (let i = startIndex; i < endIndex; i++) {
        arrayPart.push(array[i])
    }
    cardInsert(arrayPart)
    pages1(pageNum)
}
// Fonction onClick qui sert a defiler entre les pages
function pageClick(id){
    paginate(paginationArray,id)
}

// Fonctions de la Filter page

// Fonction d'insertion
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
// Fonction Modal
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
// Fonction qui remplit les select boxes
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
// Fonction onClick qui filtre les recette d'apres les select boxes
function sortBy(){
    document.querySelector('#notFound').innerHTML = ''
    document.querySelector('#pagination2').innerHTML = ''
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
    // Condition All dans les 2 select boxes
    if(category === 'All' && region === 'All'){
        let fullCatList = []
        jQuery.ajax({ 
            url: `https://themealdb.com/api/json/v1/1/list.php?c=list`, 
            type:'GET',
            async: false,
            success:function(data){
                fullCatList = data.meals
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
        paginationArray = fullMeals.flat(1)
        paginate2(paginationArray)
    }
    // Condition All que dans region
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
        paginationArray = regionAll.flat(1)
        paginate2(paginationArray)
    }
    // Condition All que dans category
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
        paginationArray = categoryAll.flat(1)
        paginate2(paginationArray)
    }
    // Condition quand on remplit les select boxes
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
    paginationArray = filteredList
    paginate2(paginationArray)
    if(filteredList.length === 0)
    document.querySelector('#notFound').innerHTML = 'Meal not found!'
}
// Fonction qui insert les touches de pagination
function pages2(pageNum){
    pagination = document.querySelector('#pagination2')
    let pages = ''
    for (let i = 1; i <= pageNum; i++) {
        pages += `<li class="page-item pe-auto"><a class="page-link pe-auto" onclick="pageClick2(${i})">${i}</a></li>`
    }
    pagination.innerHTML = pages
}
// Fonction de pagination
function paginate2(array, pageID=1){
    let pageNum = array.length/cardNum
    let endIndex = pageID*cardNum
    let startIndex = endIndex-cardNum
    let arrayPart = []
    let cards = document.getElementById('cards2')
    cards.innerHTML = ''
    for (let i = startIndex; i < endIndex; i++) {
        arrayPart.push(array[i])
    }
    cardInsert2(arrayPart)
    pages2(pageNum)
}
// Fonction onClick qui sert a defiler entre les pages
function pageClick2(id){
    paginate2(paginationArray,id)
}