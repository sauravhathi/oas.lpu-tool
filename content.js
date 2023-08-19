chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "downloadAnswers") {
        var table = document.getElementById("ResultGrid");
        var rowCount = table.rows.length - 1;
        var arr = [];
        if (table.innerText === "No Record Found. Please Try Again") {
            alert("The teacher has not yet released any questions or answers.");
            return;
        }
        else if (window.location.href.includes("DisplayResult")) {
            for (var i = 0; i < rowCount; i++) {
                var row = table.rows[i + 1];
                var question_number = "Q" + row.cells[0].innerText + ". ";
                var question = row.cells[1].innerText;
                var correct_answer = "\n\nAns: " + row.cells[2].innerText;


                arr.push({
                    question_number,
                    question,
                    correct_answer
                });
            }
            if (confirm("Are you sure you want to download the questions and answers of the test? If yes, then click on OK.")) {
                var text = arr.map((item) => item.question_number + item.question + item.correct_answer).join("\n\n");
                var TestName = `\n\t\tTestName: ` + document.getElementById("TestName").innerText + `\n\t\tMade By: https://github.com/sauravhathi\n\n\n`;
                var textFileAsBlob = new Blob([TestName + text + `\n`], { type: 'text/plain' });
                var fileNameToSaveAs = "questions_and_answers by oas.lpu-tool.txt";
                var downloadLink = document.createElement("a");
                downloadLink.download = fileNameToSaveAs;
                downloadLink.innerHTML = "Download File";
                if (window.webkitURL != null) {
                    // Chrome allows the link to be clicked
                    // without actually adding it to the DOM.
                    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
                } else {
                    // Firefox requires the link to be added to the DOM
                    // before it can be clicked.
                    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                    downloadLink.onclick = destroyClickedElement;
                    downloadLink.style.display = "none";
                    document.body.appendChild(downloadLink);
                }
                downloadLink.click();
            }
            else {
                alert("You have cancelled the download.");
            }
        }
        else {
            alert("You are not on the result page.");
        }
    }
    else if (request.message === "view_result_details") {
        if (!window.location.href.includes("DisplayResult")) {
            alert("You are not on the result page.");
            return;
        }
        var btn = document.getElementById("detailedResult");
        if (btn.style.display === "none") {
            btn.style.display = "block";
        } else {
            btn.style.display = "none";
        }
    }
    else if (request.message === "personalInfo") {
        var loginId = getCredentials("UserName");
        var name = getCredentials("Name");
        var password = getCredentials("Password");

        alert("LoginId: " + loginId + "\nName: " + name + "\nPassword: " + password);
    }
});

function encRegId(regid) {
    var dataToEnc = regid;
    var _0x6afe = ["\x38\x30\x38\x30\x38\x30\x38\x30\x38\x30\x38\x30\x38\x30\x38\x30", "\x70\x61\x72\x73\x65", "\x55\x74\x66\x38", "\x65\x6E\x63", "\x43\x42\x43", "\x6D\x6F\x64\x65", "\x50\x6B\x63\x73\x37", "\x70\x61\x64", "\x65\x6E\x63\x72\x79\x70\x74", "\x41\x45\x53"];
    var key = CryptoJS[_0x6afe[3]][_0x6afe[2]][_0x6afe[1]](_0x6afe[0]);
    var iv = CryptoJS[_0x6afe[3]][_0x6afe[2]][_0x6afe[1]](_0x6afe[0]);
    var encryptedData = CryptoJS[_0x6afe[9]][_0x6afe[8]](CryptoJS[_0x6afe[3]][_0x6afe[2]][_0x6afe[1]](dataToEnc), key, { keySize: 128 / 8, iv: iv, mode: CryptoJS[_0x6afe[5]][_0x6afe[4]], padding: CryptoJS[_0x6afe[7]][_0x6afe[6]] })

    return encryptedData.toString();
}

const getCredentials = (key) => {
    if (sessionStorage[key]) {
        return sessionStorage[key];
    }
    else{
        return localStorage[key];
    }
}

// recently attempted test
function rat() {
    if(sessionStorage.UserName && sessionStorage.Name && sessionStorage.Password){
        localStorage.setItem("UserName",sessionStorage.UserName);
        localStorage.setItem("Name",sessionStorage.Name);
        localStorage.setItem("Password",sessionStorage.Password);
    }
    var LoginId = getCredentials("UserName");
    console.log(LoginId);
    var LoginObj = new Object();
    LoginObj.LoginId = LoginId;
    fetch('https://oas.lpu.in/api/OnlineExam/GetAttemptedTestForStudent?LoginId=' + LoginId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
        "body": null,
    }
    ).then(response => response.json())
        .then(async data => {
            var arr = [];
            for (var i = 0; i < data.length; i++) {
                arr.push(data[i].TestId + "-" + data[i].TestName);
                document.getElementById('lblcreatedtest' + (i + 1)).innerHTML = `${data[i].TestName} <span style="color: #ff0000;margin:0px 5px;">${data[i].TestId}</span> <a href="https://oas.lpu.in/DisplayResult?${await encRegId(data[i].TestId)}" class="view_result" target="_blank">View Result</a>`;
            }
        })
        .catch(error => {
            alert(error);
        });
}

function view_result_details() {
    var btn = document.getElementById("detailedResult");
    btn.click();
}

if (window.location.href.includes("StudentHome")) {
    rat();
}

if (window.location.href.includes("DisplayResult")) {
    view_result_details();
}