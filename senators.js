fetch('senators.json')
  .then(response => response.json())
  .then(data => {
    senators = data.objects;
    displayTotal(senators);
    displayLeaders(senators);
    displaySenators(senators);  
    populatePartyFilter();
    populateStateFilter();
    populateRankFilter();
    populateGenderFilter();
    filterSenators();
    senatorDetails(senators);
  })

//simple function using if/else if statements, for each iterates through senators array
//increasing the party count for each check when matching the party name

function displayTotal(senators) {
  democratCount = 0;
  republicanCount = 0;
  independentCount = 0;
  
  senators.forEach(senator => {
    if (senator.party === 'Democrat') {democratCount++;} 
    else if (senator.party === 'Republican') {republicanCount++;} 
    else if (senator.party === 'Independent') {independentCount++;}
    });
  
    document.getElementById('DemocratCount').textContent = democratCount;
    document.getElementById('RepublicanCount').textContent = republicanCount;
    document.getElementById('IndependentCount').textContent = independentCount;
}

//Function checking senators array for leadership titles + names 
//Appends to list. If senator has leadership title, it appends according to party 
//Since independent don't have leaders, but I needed to display that, I added a check using 
//var = false and then independentLeadership === true, returning a message if no leaders

function displayLeaders(senators) {
  democratLeaders = document.getElementById('democratLeaders');
  republicanLeaders = document.getElementById('republicanLeaders');
  independentLeaders = document.getElementById('independentLeaders');
  let independentLeadership = false;
  senators.forEach(senator => {
    if (senator.leadership_title) {
      list = document.createElement('li');
      list.textContent = senator.leadership_title  + ":" + ' ' + senator.person.firstname + ' ' + senator.person.lastname + ' ' +  '(' + senator.party + ')';
      
      if (senator.party === 'Democrat') {
      democratLeaders.append(list);} 
      else if (senator.party === 'Republican'){
      republicanLeaders.append(list);} 
      else if (senator.party == 'Independent'){
      independentLeaders.append(list) = 'Independent';
      independentLeadership = true;
      }
    }
  });
  if (!independentLeadership) {  
    independentLeaders.innerHTML = '<li>There are no Leadership roles in the Independent Party</li>';
  }
}

//Function to display all senators with info in a table, using innerHTML to append to table 
//Closure used in event handling  adapted from https://www.w3schools.com/howto/howto_js_popup.asp
//and https://stackoverflow.com/questions/1207939/adding-an-onclick-event-to-a-table-row


function displaySenators(senators) {
senatorTable = document.getElementById('AllsenatorTable');

  for (var i = 0; i < senators.length; i++) {
    var senator = senators[i];
    var party = senator.party;
    var state = senator.state;
    var gender = senator.person.gender;
    var firstname = senator.person.firstname;
    var lastname = senator.person.lastname;
    var senatorRank = senator.senator_rank;
    var row = document.createElement('tr');
    row.innerHTML = 
      '<td>' + firstname + ' ' + lastname + '</td>'
      +'<td>' + party + '</td>'
      +'<td>' + state + '</td>'
      +'<td>' + senatorRank + '</td>'
      +'<td>' + gender + '</td>'
  
      row.onclick = (function(senatordetails) {
        return function() {
          senatorDetails(senatordetails);
        };
      })(senator);
    senatorTable.appendChild(row);
  }
}

//Function to filter senators table  
//Filters rows by iterating through rows and hiding those that don't match the criteria
//Adapted from https://stackoverflow.com/questions/9895082/javascript-populate-drop-down-list-with-array
//and https://www.w3schools.com/howto/howto_js_filter_table.asp


function filterSenators() {
    var partyInput = document.getElementById("partyInput");
    var stateInput = document.getElementById("stateInput");
    var rankInput = document.getElementById("rankInput");
    var genderInput = document.getElementById("genderInput").value.toUpperCase();
    var table = document.getElementById("AllsenatorTable");
    var tr = table.getElementsByTagName("tr");

    var partySelect = partyInput.value.toUpperCase();
    var stateSelect = stateInput.value.toUpperCase();
    var rankSelect = rankInput.value.toUpperCase();
    var matchFound = false;
    var rows = tr.length;
    rows -= 1;
    hidden_rows = 0;

    for (var i = 1; i < tr.length; i++) {
        var td = tr[i].cells;
        var tdParty = td[1].innerText.toUpperCase();
        var tdState = td[2].innerText.toUpperCase();
        var tdRank = td[3].innerText.toUpperCase();
        var tdGender = td[4].innerText.toUpperCase();

        if (
            tdParty.indexOf(partySelect) > -1 &&
            tdState.indexOf(stateSelect) > -1 &&
            tdRank.indexOf(rankSelect) > -1 &&
            (genderInput === '' || tdGender === genderInput)
        ) {
            tr[i].style.display = "";
            matchFound = true;
        } else {
            tr[i].style.display = "none";
            hidden_rows ++;
        }
    }
      errorHandle = document.getElementById("errorHandle");
      if (!matchFound) {
      errorHandle.innerHTML = "No results found. Try a different combination of filters.";
      } else {
      errorHandle.innerHTML = "";
    }
}

//Function to populate filters.  
//Event listeners makes the filters work by calling the filterSenators function when there is change
//Adapted from https://stackoverflow.com/questions/9895082/javascript-populate-drop-down-list-with-array
//and https://www.w3schools.com/jsref/met_document_addeventlistener.asp

function populatePartyFilter() {
  var partySelect = document.getElementById("partyInput");
  var parties = [];

  for (var i = 0; i < senators.length; i++) {
    var party = senators[i].party;
    if (!parties.includes(party)) {
      parties.push(party);
    }
  }

  for (var i = 0; i < parties.length; i++) {
    var option = document.createElement("option");
    option.text = parties[i];
    partySelect.appendChild(option);
  }

  partySelect.addEventListener('change', filterSenators);
}

function populateStateFilter() {
  var stateSelect = document.getElementById("stateInput");
  var states = [];

  for (var i = 0; i < senators.length; i++) {
    var state = senators[i].state;
    if (!states.includes(state)) {
      states.push(state);
    }
  }

  for (var i = 0; i < states.length; i++) {
    var option = document.createElement("option");
      option.text = states[i];
      stateSelect.appendChild(option);
  }

  stateSelect.addEventListener('change', filterSenators);
}

function populateRankFilter() {
  var rankSelect = document.getElementById("rankInput");
  var ranks = [];

  for (var i = 0; i < senators.length; i++) {
    var rank = senators[i].senator_rank_label;
    if (!ranks.includes(rank)) {
      ranks.push(rank);
      }
  }

  for (var i = 0; i < ranks.length; i++) {
    var option = document.createElement("option");
    option.text = ranks[i];
    rankSelect.appendChild(option);
  }

  rankSelect.addEventListener('change', filterSenators);
}

function populateGenderFilter() {
  var genderSelect = document.getElementById("genderInput");
  var genders = [];

    for (var i = 0; i < senators.length; i++) {
      var gender = senators[i].person.gender_label;
      if (!genders.includes(gender)) {
        genders.push(gender);
    }
  }

  for (var i = 0; i < genders.length; i++) {
    var option = document.createElement("option");
    option.text = genders[i];
    genderSelect.appendChild(option);
  }

  genderSelect.addEventListener('change', filterSenators);
}

//function to display additional senator details using popup functions
//Had issues with closing popups when clicking on more than one, 
//so added a check to remove existing popups before creating a new one (idea adapter from https://stackoverflow.com/questions/18853618/how-to-hide-the-previous-pop-up-window-when-a-new-one-is-created-in-javascript)
//Also used Adapted from https://www.w3schools.com/jsref/prop_html_classname.asp and https://www.w3schools.com/howto/howto_js_popup.asp
//and https://www.w3schools.com/js/js_popup.asp

function senatorDetails(senator) {
  var office = senator.extra.office;
  var dateOfBirth = senator.person.birthday;
  var startDate = senator.startdate;
  var twitterId = senator.person.twitterid;
  var youtubeId = senator.person.youtubeid;
  var website = senator.website;

  var popupContent = document.createElement('div');
  popupContent.innerHTML =
    '<p>Office: ' + office + '</p>' +
    '<p>Date of Birth: ' + dateOfBirth + '</p>' +
    '<p>Start Date: ' + startDate + '</p>' +
    '<p>Twitter ID: ' + twitterId + '</p>' +
    '<p>YouTube ID: ' + youtubeId + '</p>' +
    '<p>Website: <a href="' + website + '" target="_blank">' + website + '</a></p>';

  var existingPopups = document.querySelectorAll('.popup');
  existingPopups.forEach(function(popup) {
  popup.remove(); 
  });

  popup = document.createElement('div');
  popup.className = 'popup';
  popup.appendChild(popupContent);
  document.body.appendChild(popup);

  var closePopup = document.createElement('span');
  closePopup.className = 'close';
  closePopup.innerHTML = '&times;';
  closePopup.onclick = () => popup.style.display = 'none';
  popup.appendChild(closePopup);
  popup.style.display = 'block';
};



  













