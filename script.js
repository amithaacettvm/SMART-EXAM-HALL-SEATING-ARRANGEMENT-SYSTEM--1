let students = [];

let seatingData = [];

function uploadExcel() {

    const file =
        document.getElementById("excelFile").files[0];

    if (!file) {

        alert("Please select an Excel file.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {

        const data =
            new Uint8Array(event.target.result);

        const workbook =
            XLSX.read(data, { type: "array" });

        const sheetName =
            workbook.SheetNames[0];

        const worksheet =
            workbook.Sheets[sheetName];

        const excelData =
            XLSX.utils.sheet_to_json(worksheet);

        students = [];

        excelData.forEach(row => {

            students.push({

                regNo:
                    row["Registration Number"],

                branch:
                    row["Branch"]

            });

        });

        displayStudents();

        document.getElementById("totalStudents")
            .innerText = students.length;

        alert(
            students.length +
            " students imported successfully."
        );
    };

    reader.readAsArrayBuffer(file);
}

function displayStudents() {

    const table =
        document.getElementById("studentTable");

    table.innerHTML = "";

    students.forEach(student => {

        table.innerHTML +=

            `
            <tr>

                <td>${student.regNo}</td>

                <td>${student.branch}</td>

            </tr>
            `;
    });
}

function arrangeStudentsByBranch() {

    let branchGroups = {};

    students.forEach(student => {

        if (!branchGroups[student.branch]) {

            branchGroups[student.branch] = [];
        }

        branchGroups[student.branch].push(student);
    });

    let arranged = [];

    let branches =
        Object.keys(branchGroups);

    while (true) {

        let added = false;

        branches.forEach(branch => {

            if (
                branchGroups[branch].length > 0
            ) {

                arranged.push(
                    branchGroups[branch].shift()
                );

                added = true;
            }
        });

        if (!added) break;
    }

    return arranged;
}

function generateLayout() {

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

    if (
        !rows ||
        !cols ||
        !capacity
    ) {

        alert(
            "Please enter classroom configuration."
        );

        return;
    }

    const totalSeats =
        rows * cols * capacity;

    if (
        students.length > totalSeats
    ) {

        alert(
            "Not enough seats available."
        );

        return;
    }

    document.getElementById(
        "totalSeats"
    ).innerText = totalSeats;

    document.getElementById(
        "occupiedSeats"
    ).innerText = students.length;

    document.getElementById(
        "vacantSeats"
    ).innerText =
        totalSeats - students.length;

    const classroom =
        document.getElementById("classroom");

    classroom.innerHTML = "";

    seatingData = [];

    const arrangedStudents =
        arrangeStudentsByBranch();

    let studentIndex = 0;

    for (let r = 0; r < rows; r++) {

        const rowDiv =
            document.createElement("div");

        rowDiv.className =
            "classroom-row";

        for (let c = 0; c < cols; c++) {

            const bench =
                document.createElement("div");

            bench.className =
                "bench";

            const title =
                document.createElement("div");

            title.className =
                "bench-title";

            title.innerText =
                `Bench ${r + 1}-${c + 1}`;

            bench.appendChild(title);

            for (
                let s = 0;
                s < capacity;
                s++
            ) {

                if (
                    studentIndex <
                    arrangedStudents.length
                ) {

                    const student =
                        arrangedStudents[
                        studentIndex
                        ];

                    seatingData.push({

                        regNo:
                            student.regNo,

                        branch:
                            student.branch,

                        bench:
                            `Bench ${r + 1}-${c + 1}`
                    });

                    const studentDiv =
                        document.createElement("div");

                    studentDiv.className =
                        "student";

                    studentDiv.innerHTML =

                        `
                        <div class="regno">
                            ${student.regNo}
                        </div>

                        <div class="branch">
                            ${student.branch}
                        </div>
                        `;

                    bench.appendChild(
                        studentDiv
                    );

                    studentIndex++;
                }
            }

            rowDiv.appendChild(
                bench
            );
        }

        classroom.appendChild(
            rowDiv
        );
    }
}

function printLayout() {

    const classroomHTML =
        document.querySelector(
            ".board"
        ).outerHTML
        +
        document.getElementById(
            "classroom"
        ).outerHTML
        +
        document.querySelector(
            ".teacher-desk"
        ).outerHTML;

    let tableRows = "";

    seatingData.forEach(student => {

        tableRows +=

            `
            <tr>

                <td>${student.regNo}</td>

                <td>${student.branch}</td>

                <td>${student.bench}</td>

            </tr>
            `;
    });

    const printWindow =
        window.open(
            "",
            "_blank"
        );

    printWindow.document.write(

        `
        <html>

        <head>

            <title>
                Exam Seating Arrangement
            </title>

            <style>

                body{
                    font-family:Arial;
                    padding:20px;
                }

                h1{
                    text-align:center;
                }

                .classroom-row{
                    display:flex;
                    justify-content:center;
                    margin-bottom:20px;
                }

                .bench{
                    width:220px;
                    border:2px solid black;
                    padding:10px;
                    margin:10px;
                }

                .bench-title{
                    font-weight:bold;
                    text-align:center;
                    margin-bottom:10px;
                }

                .student{
                    border:1px solid #ddd;
                    padding:5px;
                    margin-bottom:5px;
                }

                .board,
                .teacher-desk{
                    text-align:center;
                    font-weight:bold;
                    margin:20px;
                }

                table{
                    width:100%;
                    border-collapse:collapse;
                    margin-top:30px;
                }

                th,
                td{
                    border:1px solid black;
                    padding:8px;
                    text-align:center;
                }

                th{
                    background:#f0f0f0;
                }

            </style>

        </head>

        <body>

            <h1>
                Exam Hall Seating Arrangement
            </h1>

            ${classroomHTML}

            <h2>
                Seating List
            </h2>

            <table>

                <tr>

                    <th>
                        Registration Number
                    </th>

                    <th>
                        Branch
                    </th>

                    <th>
                        Bench
                    </th>

                </tr>

                ${tableRows}

            </table>

        </body>

        </html>
        `
    );

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {

        printWindow.print();

    }, 500);
}
