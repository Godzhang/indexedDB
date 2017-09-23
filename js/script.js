window.onload = function(){
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

	function $(id){
		return document.getElementById(id);
	}

	const db_name = 'mydb';
	const db_version = 1;
	const db_store_name = 'dbstore';
	
	const add = $("add");
	const show = $("show");
	const find = $("find");
	const findValue = $("findValue");
	const findAsName = $("findAsName");
	const delbtn = $("delbtn");
	const clear = $("clear");
	const findRange = $("findRange");

	var name = $("name");
	var age = $("age");
	var delname = $("delname");
	var startId = $("startId");
	var findname = $("findname");
	var endId = $("endId");
	var showArea = $("showArea");
	var findResult = $("findResult");
	var delResult = $("delResult");
	var note = $("note");
	var db;

	//初始化数据库
	var request = indexedDB.open(db_name, db_version);
	request.onerror = function(event){
		console.log("fail to open: " + event.target.errorCode);
	}
	request.onsuccess = function(event){
		db = this.result;
	}
	request.onupgradeneeded = function(event){
		var store = event.target.result.createObjectStore(db_store_name, {keyPath: 'id',  autoIncrement: true}); 
	}
	//添加数据
	function addInfo(nameVal, ageVal){
		var transaction = db.transaction(db_store_name, 'readwrite');
		var store = transaction.objectStore(db_store_name);
		var req = store.add({name: nameVal, age: ageVal});
		req.onerror = function(event){
			console.log("fail to addInfo: " + event.target.errorCode);
		}
		req.onsuccess = function(event){
			note.innerHTML = "success add";
			name.value = "";
			age.value = "";
			name.focus();
		}
	}
	//信息展示,游标查询
	function showAll(){
		note.innerHTML = "";
		var transaction = db.transaction(db_store_name, 'readwrite');
		var store = transaction.objectStore(db_store_name);
		var req = store.openCursor();
		req.onerror = function(event){
			console.log("fail to showAll: " + event.target.errorCode);
		}
		req.onsuccess = function(event){
			var cursor = event.target.result;
			if(cursor){
				var elem = document.createElement("div");
				elem.appendChild(document.createTextNode(cursor.key + " : [" + cursor.value.name + "-" + cursor.value.age + "]"));
				note.appendChild(elem);
				cursor.continue();
			}else{
				console.log("done");
			}
		}
	}
	//更新个别记录
	function updateNewValue(value, password){

	}
	//查找
	function findInfo(name){
		note.innerHTML = "";
		var transaction = db.transaction(db_store_name, 'readwrite');
		var store = transaction.objectStore(db_store_name);
		var req = store.get(name);
		req.onerror = function(event){
			note.innerHTML = "fail to findKey: " + event.target.errorCode;
		}
		req.onsuccess = function(event){
			var result = event.target.result;
			if(!result){
				note.innerHTML = "not found " + name;
				return
			}
			var elem = document.createElement("div");
			elem.appendChild(document.createTextNode(result.name + "-" + result.age));
			note.appendChild(elem);
		}
	}
	//删除一项
	function deleteInfo(name){
		note.innerHTML = "";
		var transaction = db.transaction(db_store_name, 'readwrite');
		var store = transaction.objectStore(db_store_name);
		var getReq = store.get(name);
		getReq.onerror = function(event){
			note.innerHTML = "fail to findKey: " + event.target.errorCode;
		}
		getReq.onsuccess = function(event){
			var result = event.target.result;
			if(!result){
				note.innerHTML = "not found " + name;
				return
			}
			var delReq = store.delete(name);
			delReq.onerror = function(event){
				note.innerHTML = "fail to deleleInfo: " + event.target.errorCode;
			}
			delReq.onsuccess = function(event){
				note.innerHTML = "success delete";
			}
		}
		
	}
	//删除全部数据
	function clearAll(){
		note.innerHTML = "";
		var transaction = db.transaction(db_store_name, 'readwrite');
		var store = transaction.objectStore(db_store_name);
		var req = store.clear();
		req.onerror = function(event){
			note.innerHTML = "fail to clear: " + event.target.errorCode;
		}
		req.onsuccess = function(event){
			note.innerHTML = "success clear";
		}
	}
	//范围查找,键范围
	function findRangeInfo(start, end){
		note.innerHTML = "";
		var transaction = db.transaction(db_store_name, 'readwrite');
		var store = transaction.objectStore(db_store_name);
		var range = IDBKeyRange.bound(start, end);
		var req = store.openCursor(range);
		req.onerror = function(event){
			note.innerHTML = "fail to findRangeInfo" + event.target.errorCode;
		}
		req.onsuccess = function(event){
			var cursor = event.target.result;
			if(cursor){
				var elem = document.createElement("div");
				elem.appendChild(document.createTextNode(cursor.key + " : [" + cursor.value.name + "-" + cursor.value.age + "]"));
				note.appendChild(elem);
				cursor.continue();
			}else{
				console.log("done");
			}
		}
	}
	//索引查询
	// function handleAsName(name){
	// 	note.innerHTML = "";
	// 	var transaction = db.transaction(db_store_name);
	// 	var store = transaction.objectStore(db_store_name);
	// 	var index = store.index("name");
	// 	index.openCursor().onsuccess = function(event){
	// 		var cursor = event.target.result;
	// 		if(cursor){
	// 			if(cursor.key == name){
	// 				var elem = document.createElement("div");
	// 				elem.appendChild(document.createTextNode(cursor.key + " : [" + cursor.value.id + "-" + cursor.value.age + "]"));
	// 				note.appendChild(elem);
	// 				cursor.continue();
	// 			}		
	// 		}else{
	// 			console.log("done");
	// 		}
	// 	}
	// }

	// findAsName.onclick = function(){
	// 	var findnameVal = findname.value;
	// 	if(!findnameVal) return;
	// 	handleAsName(findnameVal);
	// };
	findRange.onclick = function(){
		var startVal = startId.value;
		var endVal = endId.value;
		if(!startVal || !endVal) return;
		findRangeInfo(startVal, endVal);
	}

	clear.onclick = function(){
		clearAll();
	}
	delbtn.onclick = function(){
		var delKey = delname.value;
		if(!delKey) return;
		deleteInfo(delKey);
	}
	findValue.onclick = function(){
		var nameKey = find.value;
		if(!name) return;
		findInfo(nameKey);
	}
	show.onclick = function(){
		showAll();
	}
	add.onclick = function(){
		var nameVal = name.value;
		var ageVal = age.value;

		if(!nameVal || !ageVal) return;
		addInfo(nameVal, ageVal);
	}


}
