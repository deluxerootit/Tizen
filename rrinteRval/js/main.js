
window.onload = function () {
    // TODO:: Do your initialization job

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
	try {
	    tizen.application.getCurrentApplication().exit();
	} catch (ignore) {
	}
    });

    // Sample code
    var textbox = document.querySelector('.contents');
    textbox.addEventListener("click", function(){
    	box = document.querySelector('#textbox');
    	box.innerHTML = box.innerHTML == "Basic" ? "Sample" : "Basic";
    });
    
};


function requestPermit(uri) {
	  return new Promise(function(resolve, reject) {
	    tizen.ppm.requestPermission(uri,
	      function(success) { resolve(success); },
	      function(error) { reject(error); });
	  });
	}

function main() {
	  return permitRequester('http://tizen.org/privilege/healthinfo')
	    .then(function() { return permitRequester('http://developer.samsung.com/privilege/healthinfo'); })
	    .then(function() { return permitRequester('http://developer.samsung.com/privilege/medicalinfo'); })
	    .then(function() { return displayHeartRate(); })
	    .catch(function(err) { return console.log(err); });
	}


function writeToFile(hrmInfo){
    var HRMdata,HRMInterval;	
   
    HRMdata=hrmInfo.heartRate;
    HRMInterval=hrmInfo.rRInterval;

    console.log("Data from Sensor:",HRMdata); 
    console.log("Interval from Sensor:",HRMInterval);

    var documentsDir,read;
		
    tizen.filesystem.resolve("documents", function(result) {
	documentsDir = result;
        var testFile = documentsDir.createFile("testData.txt");
        if (testFile != null) {
            testFile.openStream("rw", onOpenSuccess, null, "UTF-8");
	 }
	

        function onOpenSuccess(fs){
		                        	   
	    fs.write(HRMdata); // write HRM sensor data to file
        
            fs.position = 0;
            read=fs.read(testFile.fileSize);  //read from file
            console.log("Data from File:",read);  //output to console
		                        	
            fs.close();
       }
    });
}

tizen.humanactivitymonitor.start("HRM", writeToFile);