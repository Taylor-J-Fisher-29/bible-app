  var allowHighlighting = false;
  var buttonClicked = "";
  var highlightColor = "";
  const highlightColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-blue-500",
    "bg-rose-500",
    "bg-violet-500",
    "bg-fuchsia-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-blue-500"

  ]

  var highlightedVerses = {
     "v43003016": "bg-pink-500",
     "v43003019": "bg-red-500", 
     "v43003021": "bg-yellow-500"
};

  var themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
  var themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
  
  // Change the icons inside the button based on previous settings
  if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      themeToggleLightIcon.classList.remove('hidden');
      document.getElementById("theme-toggle").checked=true;
  } else {
      themeToggleDarkIcon.classList.remove('hidden');
      document.getElementById("theme-toggle").checked=false;
  }
  
  var themeToggleBtn = document.getElementById('theme-toggle');
  
  themeToggleBtn.addEventListener('click', function() {
  
      // toggle icons inside button
      themeToggleDarkIcon.classList.toggle('hidden');
      themeToggleLightIcon.classList.toggle('hidden');
  
      // if set via local storage previously
      if (localStorage.getItem('color-theme')) {
          if (localStorage.getItem('color-theme') === 'light') {
              document.documentElement.classList.add('dark');
              localStorage.setItem('color-theme', 'dark');
          } else {
              document.documentElement.classList.remove('dark');
              localStorage.setItem('color-theme', 'light');
          }
  
      // if NOT set via local storage previously
      } else {
          if (document.documentElement.classList.contains('dark')) {
              document.documentElement.classList.remove('dark');
              localStorage.setItem('color-theme', 'light');
          } else {
              document.documentElement.classList.add('dark');
              localStorage.setItem('color-theme', 'dark');
          }
      }
      
  });



const searchHistory = new Set();

function addHistoryItem(verse) {
  document.getElementById("history").innerHTML += "<div class=\"history-item\">" + 
  "<button class=\"cursor-pointer underline\" onclick=\"useHistory('" + verse + "')\">" + verse + "</button>"
  +"</div>";
}

function createHistory() {
  document.getElementById("history").innerHTML = "";
  searchHistory.forEach(addHistoryItem);
}

function useHistory(verse) {
  document.getElementById("search").value = verse;
  verseLookup();
}

function clearSearchHistory() {
  document.getElementById('history').innerHTML = '';
  searchHistory.clear();
}

  async function verseLookup() {
    var verse = document.getElementById("search").value; 
    var headings = document.getElementById("headings").checked;
    var extras = document.getElementById("extras").checked;
    var numbers = document.getElementById("numbers").checked;

    if (verse.match(/(\d+)/) || verse === "") {
    var url = "/api?verse=" + verse + "&headings=" + headings + "&extras=" + extras + "&numbers=" + numbers;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        document.getElementById("verse").innerHTML = data.passages.join("");
        searchHistory.add(data.query);
        createHistory();
        wrapText();
  });
} else if (verse.match(/Romans Road/i) || verse.match(/roman's road/i)) {
   document.getElementById("verse").innerHTML = "<h1>Romans Road to Salvation</h1>";
   let verses = [
    "Romans 3:23",
    "Romans 3:12",
    "Romans 5:10",
    "Romans 6:23",
    "Romans 5:8",
    "Romans 10:9-10",
    "Romans 10:13",
    "Romans 10:17"
   ];
  let collector = "";
    getDataInOrder(verses).then(data => {
      let count = data.length;
      data.forEach(obj => {
       collector += obj.passages.join("");
        if (--count == 0) {
           document.getElementById("verse").innerHTML += collector;
          searchHistory.add("Romans Road");
         createHistory();
         wrapText();
      }
    });
  });

} else {
  var url = "search?search=" + verse;
  fetch(url)
   .then(response => response.json())
    .then(data => {
      let html = '<ul>';
      data.results.forEach(obj => {
        html += "<li><button class=\"cursor-pointer underline\" onclick=\"useHistory('" + obj.reference + "')\">" + obj.reference + "</button>"
        html += ` -- ${obj.content}</li>`;
      });
      html += '</ul>';
      document.getElementById("verse").innerHTML = html;
      searchHistory.add(verse);
      createHistory();
});
}
    window.scrollTo(0, 0);
  }


async function getDataInOrder(verses) {
  const promises = verses.map(verse => {
    let url = "/api?verse=" + verse + "&headings=false&extras=false&numbers=false";
   return fetch(url).then(response => response.json())
  });
  return await Promise.all(promises);
}

  var inputField = document.getElementById('search');
  inputField.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      verseLookup();
    }
  });

  ["headings", "extras", "numbers"].forEach(function(id) {
    document.getElementById(id).addEventListener('change', verseLookup);
    });


    function wrapText() {
      document.querySelectorAll("span.verse").forEach((span) => {
          const verseID = span.getAttribute("data-verse");
          span.addEventListener("click", (e) => {
              // Read the verse ID from the data-verse attribute
              // Assume highlightColor is set elsewhere in your script
              highlightVerseByID(verseID, highlightColor);
          });
          // Check if the verse is in the highlightedVerses array
          if (highlightedVerses[verseID]) {
              //console.log("Highlighting verse:", verseID);
              if (allowHighlighting) {
                  highlightWrapper(span, highlightedVerses[verseID]);
              } else {
                  allowHighlighting = true;
                  highlightWrapper(span, highlightedVerses[verseID]);
                  allowHighlighting = false;
              }
          }
      });
  }
  
  
  /**
   * Finds all <span class="verse" data-verse="..."> elements matching the given verseID
   * and applies highlightWrapper to each.
   *
   * @param {string} verseID        The verse ID to look for (e.g. "v45003010").
   * @param {string} highlightColor The CSS class name that highlightWrapper should apply.
   */
  function highlightVerseByID(verseID, highlightColor) {
      // Construct a selector for all <span class="verse" data-verse="verseID">
      const selector = `span.verse[data-verse="${verseID}"]`;
      const wrappers = document.querySelectorAll(selector);
  
      wrappers.forEach((wrapper) => {
          highlightWrapper(wrapper, highlightColor);
      });
  
  }

function highlightWrapper(wrapper, highlightColor) {
  const children = wrapper.children;
    if (allowHighlighting) {
      if (hasClass(wrapper, highlightColor)) {
        removeClass(wrapper, highlightColor);
       for (child of children) {
          if(hasClass(child, "woc-highlighted")) {
          removeClass(child, "woc-highlighted");
          addClass(child, "woc");
       }
      }
      } else {
           highlightColors.forEach(color => {
          removeClass(wrapper, color);
      });
      addClass(wrapper, highlightColor);
      for (child of children) {
          if(hasClass(child, "woc")) {
          removeClass(child, "woc");
          addClass(child, "woc-highlighted");
         }
       }
      }
    }
 }


function HighlightButtonClicked(me) {
   // console.log(me.id);
    var buttons = document.querySelectorAll(".highlight-button");
    buttons.forEach(button => {
      removeClass(button, "border-violet-500");
      removeClass(button, "dark:border-rose-200");
      addClass(button, "border-transparent");
    });
    if (allowHighlighting && me.id === buttonClicked) {
        allowHighlighting = false;
    } else {
      removeClass(me, "border-transparent");
      addClass(me, "dark:border-rose-200");
      addClass(me, "border-violet-500")
        buttonClicked = me.id;
        allowHighlighting = true;
        highlightColor = "bg-" + me.id.split("-")[1] + "-500";
        //console.log(highlightColor);
    }
}




    function hasClass(ele, cls) {
      return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  }
  
  function addClass(ele, cls) {
      if (!hasClass(ele, cls)) ele.className += " " + cls;
  }
  
  function removeClass(ele, cls) {
      if (hasClass(ele, cls)) {
          var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
          ele.className = ele.className.replace(reg, ' ');
      }
  }
  
  //Add event from js the keep the marup clean
  function init() {
      document.getElementById("open-menu").addEventListener("click", toggleMenu);
      document.getElementById("body-overlay").addEventListener("click", toggleMenu);
  }
  
  //The actual fuction
  function toggleMenu() {
      var ele = document.getElementsByTagName('body')[0];
      if (!hasClass(ele, "menu-open")) {
          addClass(ele, "menu-open");
      } else {
          removeClass(ele, "menu-open");
      }
  }
  
  //Prevent the function to run before the document is loaded
  document.addEventListener('readystatechange', function() {
      if (document.readyState === "complete") {
          init();
      }
  });

