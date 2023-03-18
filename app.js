let images = document.querySelectorAll('section img');
let imageContainer = document.querySelector('main section:first-of-type');
let resultsList = document.querySelector('aside ul');
let aside = document.querySelector('aside');
let summary = document.querySelector('main section:last-of-type');
let summaryHeader = document.querySelector('main h2');
let showResultsBtn = document.querySelector('button');

let votes = 0;

let productImageUrls = [
  './img/bag.jpg',
  './img/banana.jpg',
  './img/bathroom.jpg',
  './img/boots.jpg',
  './img/breakfast.jpg',
  './img/bubblegum.jpg',
  './img/chair.jpg',
  './img/cthulhu.jpg',
  './img/dog-duck.jpg',
  './img/dragon.jpg',
  './img/pen.jpg',
  './img/pet-sweep.jpg',
  './img/scissors.jpg',
  './img/shark.jpg',
  './img/tauntaun.jpg',
  './img/unicorn.jpg',
  './img/water-can.jpg',
  './img/wine-glass.jpg',
];

function Product(name, src) {
  this.name = name;
  this.src = src;
  this.views = 0;
  this.clicks = 0;
}

// IIFE creates an array products from array of urls
Product.products = (function () {
  let products = [];
  productImageUrls.forEach((url) => {
    let name = url.slice(6, -4);
    let product = new Product(name, url);
    products.push(product);
  });
  return products;
})();

function threeUniqueRandoms(min, max, numbers) {
  if (!numbers) numbers = [];

  let newNumbers = [];
  while (newNumbers.length < 3) {
    let number = Math.floor(Math.random() * (max - min) + min);
    while (numbers.includes(number)) {
      number = Math.floor(Math.random() * (max - min) + min);
    }
    if (!newNumbers.includes(number)) newNumbers.push(number);
  }
  return newNumbers;
}

function placeRandomImages() {
  let imagesArr = Array.from(images);
  let imageIndexes = imagesArr.map((image) => {
    let imageSrc = image.getAttribute('src');
    return productImageUrls.indexOf(imageSrc);
  });

  let indexes = threeUniqueRandoms(0, productImageUrls.length, imageIndexes);

  images.forEach((image, index) => {
    let i = indexes[index];
    image.src = productImageUrls[i];
    Product.products.forEach((product) => {
      if (productImageUrls[i] === product.src) {
        product.views++;
      }
    });
  });
}

function castVote(e) {
  // console.log(e.target.nodeName === 'IMG');
  if (votes === 25) {
    imageContainer.removeEventListener('click', castVote);
    return;
  }
  if (e.target.nodeName !== 'IMG') {
    alert('Please Select an Image');
    return;
  } else {
    votes++;
    let product = Product.products.find(
      (product) => e.target.getAttribute('src') === product.src
    );
    product.clicks++;
  }
  placeRandomImages();
}
function showResults() {
  if (votes < 25) {
    alert('25 votes must be cast before viewing results');
    return;
  }
  Product.products.forEach((product) => {
    let result = document.createElement('li');
    result.innerText = `${product.name} :\n ${product.clicks} vote${
      product.clicks === 1 ? '' : 's'
    }\n ${product.views} view${product.views === 1 ? '' : 's'}`;
    resultsList.append(result);
  });
  imageContainer.style.gridColumn = '2 / 4';
  summaryHeader.style.gridColumn = '2 / 4';
  summary.style.gridColumn = '2 / 4';
  aside.classList.add('results');
  showResultsBtn.remove();
}
// event listeners
imageContainer.addEventListener('click', castVote);
showResultsBtn.addEventListener('click', showResults);
placeRandomImages();
