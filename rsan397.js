function getCourses() {
	const uri= "http://localhost:8188/UniProxService.svc/courses";
	const xhr = new XMLHttpRequest();
	xhr.open("GET", uri, true);
	xhr.onload= () => {
		const resp= JSON.parse(xhr.responseText);
		showCourses(resp.data);
		
	}
	xhr.send(null);
}

function showCourses(courses) {
	let tableContent= "";
	courses.sort(function(a,b){ return parseInt(a.catalogNbr) - parseInt(b.catalogNbr);});
	
	// add each record as a row in the table
	for (let i = 0; i < courses.length; ++i) {
		const record = courses[i];
		const courseNumber = record.catalogNbr;

		const head = record.subject + " " + courseNumber;
		tableContent += "<tr><td class=" + "headCourse" + ">"+ head + "</td></tr>\n<tr><td>"+ record.titleLong+ "</td></tr>\n";
		if (typeof(record.rqrmntDescr) != "undefined" && record.rqrmntDescr != "."){
			tableContent += "<tr><td>"+ record.rqrmntDescr+ "</td></tr>\n";
		}
		if (typeof(record.description) != "undefined"){
			tableContent += "</td></tr>\n<tr><td>"+ record.description+ "</td></tr>\n";
		}
		tableContent += "<tr><td style=" + "color:blue " +"id=" + courseNumber +" onclick=" + "getTimetables(this.id)>" + "Lectures, Labs and Tutorial Information" + "</td></tr>\n";

	}
	document.getElementById("showTab").innerHTML= tableContent;
}

function getTimetables(courseNumber) {
	const uri= "http://localhost:8188/UniProxService.svc/course?c=" + courseNumber;
	const xhr = new XMLHttpRequest();
	xhr.open("GET", uri, true);
	xhr.onload= () => {
		const resp= JSON.parse(xhr.responseText);
		classTimetables(resp.data);
		
	}
	xhr.send(null);
}

function classTimetables(details){
	let tableContentSecond= "";
	let title = "<tr><td><h3>Second Semester 2018</h3></td></tr>\n";
	tableContentSecond += title;
	let lectureTable="";
	const header= "<tr class=" +"headCourse" + "><td>Day</td><td>Start Time</td><td>End Time</td><td>Room</td></tr>\n";
	//lectureTable += "<tr class=" + "headCourse" + "><td>" + "Lectures" + "</td></tr>\n" + header;
	let tutorialTable="";
	//tutorialTable += "<tr class=" + "headCourse" + "><td>" + "Tutorials" + "</td></tr>\n" + header;
	let labTable="";
	//labTable += "<tr class=" + "headCourse" + "><td>" + "Labs" + "</td></tr>\n" + header;

	for (let i = 0; i <details.length; ++i) {
		let type = ""
		const record = details[i];
		if (record.term =="1185"){
			if (record.component =="LEC"){
				record.meetingPatterns.forEach(function(item){ 
					lectureTable += "<tr><td>"+ item.daysOfWeek.toUpperCase() + "</td><td>"+ item.startTime + "</td><td>"+ item.endTime + "</td><td>" + item.location + "</td></tr>\n";
				});
			}
			else if(record.component =="TUT"){
				record.meetingPatterns.forEach(function(item){ 
					tutorialTable += "<tr><td>"+ item.daysOfWeek.toUpperCase() + "</td><td>"+ item.startTime + "</td><td>"+ item.endTime + "</td><td>" + item.location + "</td></tr>\n";
				});
			}
			else if(record.component =="LAB"){
				record.meetingPatterns.forEach(function(item){ 
					labTable += "<tr><td>"+ item.daysOfWeek.toUpperCase() + "</td><td>"+ item.startTime + "</td><td>"+ item.endTime + "</td><td>" + item.location + "</td></tr>\n";
				});
			}
		
		}
	}
	showTabB2();
	if (lectureTable != ""){
		tableContentSecond+="<tr class=" + "headCourse" + "><td>" + "Lectures" + "</td></tr>\n" + header;
		tableContentSecond+=lectureTable
	}
	if (tutorialTable != ""){
		tableContentSecond += "<tr class=" + "headCourse" + "><td>" + "Tutorials" + "</td></tr>\n" + header;
		tableContentSecond += tutorialTable;
	}
	if(labTable != ""){
		tableContentSecond +="<tr class=" + "headCourse" + "><td>" + "Labs" + "</td></tr>\n" + header;
		tableContentSecond +=labTable
	}
	document.getElementById("showClassesTab").innerHTML= tableContentSecond;
}

function getPeople() {
	const uri= "http://localhost:8188/UniProxService.svc/people";
	const xhr = new XMLHttpRequest();
	xhr.open("GET", uri, true);
	xhr.onload= () => {
		const resp= JSON.parse(xhr.responseText);
		showPeople(resp.list);
		
	}
	xhr.send(null);
}

function showPeople(people) {
	let tableContent= "";
	people.sort((a, b) => a.lastname.localeCompare(b.lastname));
	
	// add each destination record as a row in the table
	for (let i = 0; i < people.length; ++i) {
		const record = people[i];
		let URL = "";
		const ID = record.profileUrl[1];
		if (typeof(record.imageId) != "undefined"){
			const imageID = record.imageId;
			URL = "<img src=" + "https://unidirectory.auckland.ac.nz/people/imageraw/" + ID + "/" + imageID + "/small" +" alt=" + "photo" + ">";
		}
		else{
			URL = "<img src=" + "http://redsox.uoa.auckland.ac.nz/ups/logo-115x115.png" + " alt=" + "photo" + ">";
		}
		const vCard = "<a href=" + "https://unidirectory.auckland.ac.nz/people/vcard/" + ID + ">" + "Save to Contacts" + "</a>";
		const head = record.firstname + " " + record.lastname;
		tableContent += "<tr><td>"+ URL + "</td></tr><tr><td class=" + "headCourse" + ">" + head + "</td></tr>\n";
		if (typeof(record.extn) != "undefined"){
			const extension = record.extn
			const phone = "<tr><td>"+ "<a href=" + "tel:6493737999," + extension + ">" + "Tel: +64 9 373 7999; ext: " + extension + "</a></td></tr>\n";
			tableContent += phone;
		}
		const email = "<tr><td>"+ "<a href=" + "mailto:" + record.emailAddresses + ">" + record.emailAddresses + "</a>" + "</td></tr>\n";
		tableContent += email;
		tableContent += "<tr><td>" + vCard + "</td></tr>\n";

	}
	document.getElementById("showPeopleTab").innerHTML= tableContent;
}

function getNews() {
	const uri= "http://localhost:8188/UniProxService.svc/news";
	const xhr = new XMLHttpRequest();
	xhr.open('GET', uri, true);
	xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
	xhr.setRequestHeader("Accept", "application/json; charset=UTF-8");
	let data = "";
	xhr.onload= () => {
		data = xhr.responseText;
		const resp = JSON.parse(data);
		showNews(resp);
	}
	xhr.send(null);
}

function showNews(news) {
	let tableContent= "";
	
	for (let i = 0; i < news.length; ++i) {
		const record = news[i];
		const head = "<a href=" + record.linkField + ">" + record.titleField + "</a>";
		tableContent += "<tr><td>"+ head + "</td></tr>\n<tr><td>"+ record.pubDateField + "</td></tr>\n"+ "<tr><td>"+ record.descriptionField + "</td></tr>\n";
	}
	document.getElementById("showNewsTab").innerHTML= tableContent;
}

function getNotices() {
	const uri= "http://localhost:8188/UniProxService.svc/notices";
	const xhr = new XMLHttpRequest();
	xhr.open('GET', uri, true);
	xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
	xhr.setRequestHeader("Accept", "application/json; charset=UTF-8");
	let data = "";
	xhr.onload= () => {
		data = xhr.responseText;
		const resp = JSON.parse(data);
		showNotices(resp);
	}
	xhr.send(null);
}

function showNotices(notices) {
	let tableContent= "";
	
	for (let i = 0; i < notices.length; ++i) {
		const record = notices[i];
		const head = "<a href=" + record.linkField + ">" + record.titleField + "</a>";
		tableContent += "<tr><td>"+ head + "</td></tr>\n<tr><td>"+ record.descriptionField + "</td></tr>\n";
	}
	document.getElementById("showNoticesTab").innerHTML= tableContent;
}

function getComments() {
	const comment = document.getElementById("textArea").value;
	const name = document.getElementById("nameInput").value;
	const uri= " http://localhost:8188/UniProxService.svc/comment" + "?name=" + name;
	const xhr = new XMLHttpRequest();
	xhr.open('POST', uri, true);
	xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
	xhr.setRequestHeader("Accept", "application/json; charset=UTF-8");
	let data = "";
	xhr.onload= () => {
		data = xhr.responseText;
		showComments(data, name);
	}
	xhr.send(JSON.stringify(comment));
}

function showComments(data, name) {
	let tableContent= "";
	tableContent += "<tr><td>"+ data + "----" + name + "</td></tr>\n";
	
	let x = document.getElementById("showGuestTab");
	x.innerHTML +=tableContent;
}

	function getRegister() {
		const username = document.getElementById("userId").value;
		const password = document.getElementById("userPassword").value;
		const address = document.getElementById("userAddress").value;
		let obj = new Object();
			obj.Address = address;
			obj.Name = username;
			obj.Password = password;
		const uri= "http://localhost:8188/UniProxService.svc/register"
		const xhr = new XMLHttpRequest();
		xhr.open('POST', uri, true);
		xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
		xhr.setRequestHeader("Accept", "application/json; charset=UTF-8");
		xhr.onload= () => {
			comment = xhr.responseText;
			let tableContent = "";
			tableContent += "<td><tr>" + comment + "</tr></td>";
			let x = document.getElementById("showRegisterTab");
			x.innerHTML = tableContent;
		}
		xhr.send(JSON.stringify(obj));
	}

	function getSoftware() {
		//let searchTable2 = document.getElementById("showSoftwareTab");
		//searchTable2.style.display = "inline";
		const uri= "http://localhost:8188/UniProxService.svc/itemlist";
		const xhr = new XMLHttpRequest();
		xhr.open("GET", uri, true);
		xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
		xhr.setRequestHeader("Accept", "application/json; charset=UTF-8");
		let data = "";
		xhr.onload= () => {
			data = xhr.responseText;
			const resp= JSON.parse(data);
			showSoftware(resp);
		}
		xhr.send(null);
	}

	function searchSoftware(){
		//let searchTable = document.getElementById("showSoftwareTab");
		//searchTable.style.display = "none";
		let term = document.getElementById("searchValue").value;
		const uri= "http://localhost:8188/UniProxService.svc/search?term=" + term;
		const xhr = new XMLHttpRequest();
		xhr.open("GET", uri, true);
		xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
		xhr.setRequestHeader("Accept", "application/json; charset=UTF-8");
		let data = "";
		xhr.onload= () => {
			data = xhr.responseText;
			const resp= JSON.parse(data);
			showSoftware(resp);
		}
		xhr.send(null);
	}
	
	function showSoftware(items) {
		let tableContent= "";
		// add each record as an item in the table
		for (let i = 0; i < items.length; ++i) {
			const record = items[i];
			const itemId = record.ItemId;
			const title = record.Title;
			const download = "<button type=" + "button " + "value=" + itemId + " onclick=" + "getDownload(this);" + ">" + "Download </button>";
			const softImage ="<img src=" + "http://localhost:8188/UniProxService.svc/img?id=" + itemId + " alt=" + "photo" + ">";
			tableContent += "<tr><td>" + softImage + "</td><td>" + title + "</td><td>" + download + "</td></tr>";
		}
		document.getElementById("showSoftwareTab").innerHTML= tableContent;
	}
	
	function getDownload(element){
		let username3 = document.getElementById("userName2").value;
		let password3 = document.getElementById("passWord2").value;
		if (username3 !== "" && username3 !== null){
			let itemId2 = element.value;
			const uri = "http://localhost:8189/Service.svc/dl?id=" + itemId2;
			const xhr = new XMLHttpRequest();
			xhr.open("GET", uri, true, username3, password3);
			xhr.withCredentials = true;
			xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
			xhr.setRequestHeader("Accept", "application/json; charset=UTF-8");
			let data = "";
			xhr.onload= () => {
				data = xhr.responseText;
				const resp= JSON.parse(data);
				window.alert(resp);
				showTabH();
			}
			xhr.send(null);
		}
		else{
			showTabI();
		}
	}

	function getLogin() {
		const username2 = document.getElementById("userName2").value;
		const password2 = document.getElementById("passWord2").value;
		const uri = "http://localhost:8189/Service.svc/user";
		const xhr = new XMLHttpRequest();
		xhr.open('GET', uri, true, username2, password2);
		xhr.withCredentials = true;
		xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
		xhr.setRequestHeader("Accept", "application/json; charset=UTF-8");
		xhr.onload= () => {
			comment = xhr.responseText;
			let tableContent = "";
			let statusTd = "";
			if (xhr.status === 200){
				tableContent += "<td><tr> Login Successful </tr></td>";
				let logoutButton = "<button " + "onclick=" + "getLogout()" + ">" + "Logout" + "</button>";
				statusTd += "<td><tr>" + "User logged in " + "(" + logoutButton + ")"+ "</tr></td>";
			}
			else {
				tableContent += "<td><tr> Login Unsuccessful </tr></td>"
			}
			let x = document.getElementById("showLoginTab");
			x.innerHTML = tableContent;
			let y = document.getElementById("showStatusTab");
			y.innerHTML = statusTd;
		}
		xhr.send(null);
	}
	
	function getLogout() {
		let tempUser = document.getElementById("userName2").value = null;
		let tempPass = document.getElementById("passWord2").value = null;
		let statusTd = "";
		let y = document.getElementById("showStatusTab");
		y.innerHTML = statusTd;
		let tableContent = "";
		let x = document.getElementById("showLoginTab");
		x.innerHTML = tableContent;
	}
	
