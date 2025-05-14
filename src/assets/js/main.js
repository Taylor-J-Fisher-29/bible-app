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
    var url = "/api?verse=" + verse + "&headings=" + headings + "&extras=" + extras + "&numbers=" + numbers;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        document.getElementById("verse").innerHTML = data.passages.join("");
        searchHistory.add(data.query);
        createHistory();
        wrapText();
  })
      .then (createHistory());
    window.scrollTo(0, 0);
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
      const anchors = document.querySelectorAll("a.va");
      anchors.forEach((anchor) => {
          const wrapper = document.createElement("span");
          wrapper.classList.add("verse");
          const verseId = anchor.getAttribute("rel"); // e.g., "v40001007"
          if (verseId) {
              wrapper.setAttribute("data-verse", verseId);
          }
  
          let current = anchor;
          const parent = anchor.parentNode;
  
          // Add the anchor itself to the wrapper
          wrapper.appendChild(current.cloneNode(true));
          let next = current.nextSibling;
  
          // Wrap content until the next anchor
          while (next && !(next.nodeType === 1 &&
              (next.matches("a.va")
                  || next.classList.contains("verse-num")
                  || next.tagName.toLowerCase() === "p"))) {
              const sibling = next.nextSibling;
              wrapper.appendChild(next);
              next = sibling;
          }
          // Insert the wrapper before the anchor, then remove the original
          parent.insertBefore(wrapper, anchor);
          anchor.remove();
  
          // Add click-to-highlight functionality
          wrapper.addEventListener("click", () => {
            highlightWrapper(wrapper, highlightColor);
            var verseId = wrapper.getAttribute("data-verse");
            
            if (highlightedVerses[verseId] && highlightedVerses[verseId] === highlightColor) {
              delete highlightedVerses[verseId];
            } else {
              highlightedVerses[verseId] = highlightColor;
            }
        });

          //check if verse is in the highlightedVerses array
          if (highlightedVerses[verseId]) {
            console.log("highlighting verse:", [verseId]);
            allowHighlighting = true;
            highlightWrapper(wrapper, highlightedVerses[verseId]);
            allowHighlighting = false;

           }
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

