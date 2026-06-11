let students = [];

function uploadExcel(){

    const file =
        document.getElementById("excelFile").files[0];

    if(!file){

        alert("Please select an Excel file.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event){

        const data =
            new Uint8Array(event.target.result);

        const workbook =
            XLSX.read(data,{type:'array'});

        const firstSheet =
            workbook.SheetNames[0];

        const worksheet =
            workbook.Sheets[firstSheet];

        const excelData =
            XLSX.utils.sheet_to_json(worksheet);

        students = [];

        excelData.forEach(row=>{

            students.push({

                regNo:
                row["Registration Number"],

                branch:
                row["Branch"]

            });

        });

        displayStudents();

        alert(
            students.length +
            " students imported successfully."
        );
    };

    reader.readAsArrayBuffer(file);
}

function displayStudents(){

    const table =
        document.getElementById("studentTable");

    table.innerHTML = "";

    students.forEach(student=>{

        table.innerHTML +=

        `<tr>

            <td>${student.regNo}</td>

            <td>${student.branch}</td>

        </tr>`;
    });
}

function shuffle(array){

    for(let i=array.length-1;i>0;i--){

        const j =
        Math.floor(Math.random()*(i+1));

        [array[i],array[j]]
        =
        [array[j],array[i]];
    }

    return array;
}

function generateLayout(){

    const rows =
    parseInt(
        document.getElementById("rows").value
    );

    const cols =
    parseInt(
        document.getElementById("cols").value
    );

    const capacity =
    parseInt(
        document.getElementById("capacity").value
    );

    const totalSeats =
    rows * cols * capacity;

    if(students.length > totalSeats){

        alert(
        "Not enough seats available."
        );

        return;
    }

    const classroom =
        document.getElementById("classroom");

    classroom.innerHTML = "";

    const shuffled =
        shuffle([...students]);

    let studentIndex = 0;

    for(let r=0;r<rows;r++){

        const rowDiv =
        document.createElement("div");

        rowDiv.className =
        "classroom-row";

        for(let c=0;c<cols;c++){

            const bench =
            document.createElement("div");

            bench.className =
            "bench";

            const title =
            document.createElement("div");

            title.className =
            "bench-title";

            title.innerHTML =
            `Bench ${r+1}-${c+1}`;

            bench.appendChild(title);

            for(let s=0;s<capacity;s++){

                if(studentIndex <
                   shuffled.length){

                    const studentDiv =
                    document.createElement("div");

                    studentDiv.className =
                    "student";

                    studentDiv.innerHTML =

                    `
                    ${shuffled[studentIndex].regNo}
                    <br>
                    <span class="branch">
                    ${shuffled[studentIndex].branch}
                    </span>
                    `;

                    bench.appendChild(
                        studentDiv
                    );

                    studentIndex++;
                }
            }

            rowDiv.appendChild(bench);
        }

        classroom.appendChild(rowDiv);
    }
}