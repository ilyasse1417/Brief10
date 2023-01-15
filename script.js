// Page d'acceuil => barre de recherche (tri automatique par nom de recette)
// Page d'acceuil => 6 cartes de recettes affichées aléatoirement
// Deuxième page contient deux listes déroulantes (Catégories - Région)
// La catégorie (Lamb) et la région (Moroccan) sont séléctionnés par défaut
// Pagination avec 6 recettes par page maximum
// La carte de recette doit contenir son nom, image et un boutton qui affiche plus de details en une fenêtre modale
/* fenêtre modale affiche le nom, l'image, la catégorie, la région, la liste des ingrédients et les instructions de préparation */
  
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