const ctx = document.getElementById('myChart');
const images = document.querySelectorAll('section img');
const mainGrid = document.querySelector('main');
const imageContainer = document.querySelector('main section:first-of-type');
const resultsList = document.querySelector('aside ul');
const aside = document.querySelector('aside');
const summary = document.querySelector('main section:last-of-type');
const summaryHeader = document.querySelector('main section h2');
const showResultsBtn = document.querySelector('button');
const canvasSection = document.querySelector('main section:nth-child(2)');

const MAX_VOTES = 25;

let votes = 0;

const productImageUrls = [
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

function setProducts() {
  if(!localStorage.getItem('products')) {
    // IIFE creates an array of products from array of urls
    Product.products = (function () {
      let products = [];
      productImageUrls.forEach((url) => {
        // name of product is in the file path of the image
        let name = url.slice(6, -4);
        let product = new Product(name, url);
        products.push(product);
      });

      let productsString = JSON.stringify(products);
      localStorage.setItem('products', productsString);
      return products;
    })();
  } else {
    Product.products = JSON.parse(localStorage.getItem('products'));
  }
}
setProducts();

// IIFE creates an array of names from array of urls
Product.names = (function () {
  let names = [];
  productImageUrls.forEach((url) => {
    let name = url.slice(6, -4);
    names.push(name);
  });
  return names;
})();

function threeUniqueRandoms(min, max, numbers = []) {
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
  if (votes === MAX_VOTES) {
    imageContainer.removeEventListener('click', castVote);
    return;
  }
  if (e.target.nodeName !== 'IMG') {
    alert('Please Select an Image');
    return;
  }
  votes++;
  let product = Product.products.find(
    (product) => e.target.getAttribute('src') === product.src
  );
  product.clicks++;

  placeRandomImages();
}

function showResults() {
  if (votes < MAX_VOTES) {
    alert(`${MAX_VOTES} votes must be cast before viewing results`);
    return;
  }

  Product.products.forEach((product) => {
    let result = document.createElement('li');
    //hand plural clicks and view
    result.innerText = `${product.name}:
                        ${product.clicks} vote${product.clicks === 1 ? '' : 's'} 
                        ${product.views} view${product.views === 1 ? '' : 's'}`;
    resultsList.append(result);
  });

  mainGrid.style.gridTemplateColumns = '1fr 6fr';
  mainGrid.style.gridTemplateRows = '1fr 2fr';

  imageContainer.style.gridColumn = '1 / 3';
  imageContainer.style.gridRow = '1 / 2';

  canvasSection.style.gridColumn = '2 / 3';
  canvasSection.style.gridRow = '2 / 3';

  aside.classList.add('results');

  summaryHeader.remove();
  summary.remove();
  showResultsBtn.remove();

  let productClickData = Product.products.map((product) => product.clicks);
  let productViewData = Product.products.map((product) => product.views);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Product.names,
      datasets: [
        {
          label: '# of Votes',
          data: productClickData,
          borderWidth: 1,
        },
        {
          label: '# of Views',
          data: productViewData,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// event listeners
imageContainer.addEventListener('click', castVote);
showResultsBtn.addEventListener('click', showResults);

// entry point
placeRandomImages();

