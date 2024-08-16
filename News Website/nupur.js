const API_KEY = "e714daa6b09e4501ae46c8e031ef3438";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        const data = await res.json();
        if (data.status === "ok" && data.articles.length > 0) {
            bindData(data.articles);
        } else {
            showErrorMessage(`No news articles found for "${query}".`);
        }
    } catch (error) {
        console.error("Error fetching the news:", error);
        showErrorMessage("An error occurred while fetching the news. Please try again later.");
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);

        const newsImg = cardClone.querySelector("#news-img");
        const newsTitle = cardClone.querySelector("#news-title");
        const newsSource = cardClone.querySelector("#news-source");
        const newsDesc = cardClone.querySelector("#news-desc");

        newsImg.src = article.urlToImage;
        newsImg.alt = article.title;
        newsTitle.textContent = article.title;
        newsSource.textContent = `Source: ${article.source.name} - ${new Date(article.publishedAt).toLocaleDateString()}`;
        newsDesc.textContent = article.description;

        cardClone.firstElementChild.addEventListener("click", () => {
            window.open(article.url, "_blank");
        });

        cardsContainer.appendChild(cardClone); 
    });
}

let curselectednav = null;

function onNavItemClick(id) {
    fetchNews(id);
    const navitem = document.getElementById(id);
    curselectednav?.classList.remove('active');
    curselectednav = navitem;
    curselectednav.classList.add('active');
}

const searchbutton = document.getElementById('search-button');
const searchtext = document.getElementById('search-text');
searchbutton.addEventListener('click', () => {
    const query = searchtext.value;
    if (!query) return;
    fetchNews(query);
    curselectednav?.classList.remove("active");
    curselectednav = null;
});

function showErrorMessage(message) {
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = `<div class="error-message">${message}</div>`;
}
