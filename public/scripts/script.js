
let activeState = {};
const searchInput = document.getElementById('searchinput');
searchInput.addEventListener('focusout', search);

window.addEventListener('load', ()=>{
    const carouselScript = document.createElement('script');
    carouselScript.src = '/scripts/carousel.js'
    document.body.appendChild(carouselScript);
});

document.addEventListener('DOMContentLoaded',()=>{
    const activeBtn = document.getElementById('all');
    const glideMinScript = document.createElement('script');
    document.body.appendChild(glideMinScript);
    glideMinScript.src = '/scripts/glide.min.js';
    activeBtn.classList.add('white');
    activeState.btn = activeBtn;
    buildItems('all')
})

//********* categories buttons  **********/
const btns = document.getElementsByTagName('button');
for(const btn of btns){btn.addEventListener('click',(e)=>{
    setActiveState(e);
})}



function setActiveState (evt){
    activeState.btn.classList.remove('white');
    evt.currentTarget.classList.add('white');
    activeState.btn = evt.currentTarget;
    buildItems(evt.currentTarget.id)
}



async function buildItems(category){
    const mainContainer = document.getElementById('items-container');
    mainContainer.innerHTML = ''
    try {
        let windowSize = window.innerWidth;
        const response = await fetch('/readjson');
        const data = await response.json();
        const filteredResults = filterByCategory(data,category);
        renderItems(filteredResults,category,windowSize,mainContainer); 
       

    } catch (error) {
        
    }
}


function filterByCategory(data,category){
    let result = []
    for(let i = 0; i < data.length; i++){
        let item = [];
        if(category === 'Movies' && data[i].category === 'Movie'){
            item.push(data[i]);
            item.push(i);
        }else if(category === 'series' && data[i].category === 'TV Series'){
            item.push(data[i]);
            item.push(i);
        }else if(category === 'bookmark' && data[i].isBookmarked){
            item.push(data[i]);
            item.push(i)
        }else if(category === 'all'){
            item.push(data[i]);
            item.push(i);
        }
        if(item.length > 0){
            result.push(item);
        }
    }
    if(category === 'all'){
        result.push(true);
    }else{
        result.push(false);
    }
    return result;
}



function renderItems(data,category,windowSize,mainContainer){
    const glider_items = document.querySelector('.glide__slides');
    const mainContainerHeading = document.getElementById('header');
    const searchBar = document.getElementById('searchinput');
    if(category === 'Movies') {
        mainContainerHeading.textContent = 'Movies';
        searchBar.placeholder = 'Search for movies';
        searchBar.value = ''
    }
    if(category === 'series') {
        mainContainerHeading.textContent = 'TV Series';
        searchBar.placeholder = 'Search for TV Series';
        searchBar.value = ''
    }
    if(category === 'all'){
        mainContainerHeading.textContent = 'Recommended for you';
        searchBar.placeholder = 'Search for Movies or TV Series';
        searchBar.value = ''
    } 
    if(category === 'bookmark'){
        mainContainerHeading.textContent = 'Bookedmark Movies';
        searchBar.placeholder = 'Search for bookedmark shows';
        searchBar.value = ''
    } 
    let finalHTML = '';
    
    for(let i=0; i < data.length - 1; i++){
        
        let bookmark = data[i][0].isBookmarked ? './assets/icon-bookmark-full.svg': './assets/icon-bookmark-empty.svg';
        let image;
        let catIcon = data[i][0].category === 'Movie' ? './assets/icon-category-movie.svg' : './assets/icon-category-tv.svg'
        if(windowSize < 768) image = data[i][0].thumbnail.regular.small;
        if(windowSize >=768 && windowSize < 1024) image = data[i][0].thumbnail.regular.medium;
        if(windowSize >= 1024) image = data[i][0].thumbnail.regular.large;
        let innerHTML = `<div id="item" class="item-container">
        <div class="item-image-container group">
            <img src=${image} alt="" class="item-image">
            <div class="item-backdrop"></div>
            <div id="play-btn" class="play-btn">
                <img src="./assets/icon-play.svg" alt="">
                <p>play</p>
            </div>
             
            <img src=${bookmark} alt="" id="bookmark" data-num=${data[i][1]} class="item-bookmark">
        </div>
        <div class="item-details">
            <p>${data[i][0].year}</p>
            <p>.</p>
            <img id="category" src=${catIcon} alt="">
            <p>${data[i][0].category}</p>
            <p>.</p>
            <p>${data[i][0].rating}</p>
        </div>
        <p>${data[i][0].title}</p>
    </div>`
    //  building the html for the main container content
    finalHTML += innerHTML;
    
    // building the trending section
    if(data[i][0].isTrending){
        const listItem = document.createElement('li');
        let trendingItem = `
        <div class="relative flex-1 rounded-lg overflow-hidden group">
        <img src="${data[i][0].thumbnail.trending.large}" alt="" class="h-40 w-full group-hover:scale-110 duration-200">
        <div class="item-backdrop"></div>
        <div class="play-btn">
            <img src="./assets/icon-play.svg" alt="">
            <p>play</p>
        </div>
        <img src="${bookmark}" alt="" class="item-bookmark" data-num=${data[i][1]}>
        <div class="absolute left-4 bottom-8 item-details">
            <p>${data[i][0].year}</p>
            <p>.</p>
            <img id="category" src="${catIcon}" alt="">
            <p>${data[i][0].category}</p>
            <p>.</p>
            <p>${data[i][0].rating}</p>
        </div>
        <h2 class="absolute left-4 bottom-2 text-lg p-0 m-0 mt-1">${data[i][0].title}</h2>
        </div>
    `
    listItem.innerHTML = trendingItem;
    listItem.classList.add('glide__slide');
    glider_items.append(listItem);
    // trendingHtmlTotal += trendingItem;
    }
    // document.getElementById('slides-wrapper').innerHTML = trendingHtmlTotal;
    }
   
    mainContainer.innerHTML = finalHTML;
    [...document.getElementsByClassName('item-bookmark')].forEach(element => element.addEventListener('click',toggleBookMark));
}


async function search(event){

    const searchString = event.target.value;
    const searchStringUpper = searchString.toUpperCase()
    if(searchString === ''){
        buildItems('all');
        return;
    }else{
        try {
            const response = await fetch('/readjson');
            if(!response.ok){
                alert('an error happened while searching');
            }else{
                const data = await response.json();
                const category = activeState.btn.id;
                const activeCategoryItems = filterByCategory(data,category);
                const windowSize = window.innerWidth;
                let counter = 0;
                let finalHTML = '';
                for(let i = 0; i < activeCategoryItems.length - 1; i++){
                    const titleUppercase = activeCategoryItems[i][0].title.toUpperCase();
                    if(titleUppercase.includes(searchStringUpper)){
                        let bookmark = activeCategoryItems[i][0].isBookmarked ? './assets/icon-bookmark-full.svg': './assets/icon-bookmark-empty.svg';
                        let image;
                        let catIcon = activeCategoryItems[i][0].category === 'Movie' ? './assets/icon-category-movie.svg' : './assets/icon-category-tv.svg'
                        if(windowSize < 768) image = activeCategoryItems[i][0].thumbnail.regular.small;
                        if(windowSize >=768 && windowSize < 1024) image = activeCategoryItems[i][0].thumbnail.regular.medium;
                        if(windowSize >= 1024) image = activeCategoryItems[i][0].thumbnail.regular.large;
                        let innerHTML =  `<div id="item" class="item-container">
                        <div class="item-image-container group">
                            <img src=${image} alt="" class="item-image">
                            <div class="item-backdrop"></div>
                            <div id="play-btn" class="play-btn">
                                <img src="./assets/icon-play.svg" alt="">
                                <p>play</p>
                            </div>
                             
                            <img src=${bookmark} alt="" id="bookmark" data-num=${activeCategoryItems[i][1]} class="item-bookmark">
                        </div>
                        <div class="item-details">
                            <p>${activeCategoryItems[i][0].year}</p>
                            <p>.</p>
                            <img id="category" src=${catIcon} alt="">
                            <p>${activeCategoryItems[i][0].category}</p>
                            <p>.</p>
                            <p>${activeCategoryItems[i][0].rating}</p>
                        </div>
                        <p>${activeCategoryItems[i][0].title}</p>
                    </div>`
                    
                    finalHTML += innerHTML;
                    counter++;
                    }
                }
                const mainContainer = document.getElementById('items-container');
                mainContainer.innerHTML = '';
                mainContainer.innerHTML = finalHTML;
                [...document.getElementsByClassName('item-bookmark')].forEach(element => element.addEventListener('click',toggleBookMark));
                const mainContainerHeading = document.getElementById('header');
                mainContainerHeading.textContent = ''
                mainContainerHeading.textContent = `Found ${counter} results for ${searchString}`
            }
        } catch (error) {
            alert('please check your network connection');
        }
    }
}

async function toggleBookMark(e){
    let data = {
        index : e.target.dataset.num
    }
    try {
        const response = await fetch('/bookmark',{
            body: JSON.stringify(data),
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            }
        })
        const result = await response.json();
        if(response.ok){
            if(result.flag) e.target.src = './assets/icon-bookmark-full.svg';
            else{e.target.src = './assets/icon-bookmark-empty.svg';}
        }else{
            alert(result.text)
        }

    } catch (error) {
        alert('an error happened while bookmarking');
    }
}


