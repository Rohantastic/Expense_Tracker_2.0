var token = localStorage.getItem('token');

        //function to decode token into an object
        function parseJwt(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        }



        //automatically gets called when screen content is loaded
        document.addEventListener('DOMContentLoaded', async () => {
            try {

                token = localStorage.getItem('token');

                const decodedToken = parseJwt(token);


                const isTrue = decodedToken.ispremiumuser;

                if (isTrue === true) {
                    localStorage.setItem('isPremiumUser', 'true');
                } else {
                    localStorage.setItem('isPremiumUser', 'false');
                }

                const isPremiumUser = localStorage.getItem('isPremiumUser');

                if (isPremiumUser === 'true') {
                    document.getElementById('premiumUserMessage').innerHTML = '<p style="color: gold;">Premium User</p>';
                    document.getElementById('razorPayButton').style.display = 'none';
                    showLeaderboard();
                    download(); //will only be visible for premium user
                    monthlyExpense();//show monthly expenses
                    yearlyExpense(); //show yearlyExpenses
                    dailyExpense(); //shows daily Expenses

                }
            } catch (error) {
                console.error('Error while checking premium status:', error);
            }
        });


        //function to show leaderBoard
        function showLeaderboard() {
            const inputElement = document.createElement("input")
            inputElement.type = "button"
            inputElement.value = 'Show Leaderboard'
            inputElement.onclick = async () => {
                const token = localStorage.getItem('token')
                const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/leaderboard', { headers: { "Authorization": token } })
                //console.log(userLeaderBoardArray)

                var leaderboardElem = document.getElementById('leaderboard')
                leaderboardElem.innerHTML = '<h1> Leader Board </h1>';
                //leaderboardElem.innerHTML += '<h1> Leader Board </<h1>'
                userLeaderBoardArray.data.forEach((userDetails) => {
                    leaderboardElem.innerHTML += `<li>Name - ${userDetails.name} Total Expense - ${userDetails.ExpenseAmount || 0} </li>`
                })
            }
            const messageElement = document.getElementById("message");
            messageElement.innerHTML = '';
            messageElement.appendChild(inputElement);
        };


        //download button to download expenses file
        function download() {
            const downloadButton = document.getElementById('downloadExpenseButton');
            downloadButton.style.visibility = 'visible';
            downloadButton.addEventListener('click', async (e) => {
                e.preventDefault();
                axios.get('http://localhost:3000/expense/download', { headers: { "Authorization": token } }).then((response) => {
                    if (response.status === 200) {
                        if (response.data.fileURL) { // Check if fileURL is present in the response
                            var a = document.createElement("a");
                            a.href = response.data.fileURL;
                            a.download = 'myexpense.csv';
                            a.click();
                        } else {
                            throw new Error("File URL not found in response");
                        }
                    } else {
                        throw new Error(response.statusText);
                    }
                }).catch((err) => {
                    console.log(err);
                });

            });
        }

        //to view monthly expense
        function monthlyExpense() {
            const monthlyExpense = document.getElementById('monthlyExpense');
            monthlyExpense.style.visibility = 'visible';
            monthlyExpense.addEventListener('click', async (e) => {
                const response = await axios.get('http://localhost:3000/expense/monthlyExpense', { headers: { "Authorization": token } });
                if (response && response.data && response.data.data) {
                    expenseList.innerHTML = '';
                    
                    response.data.data.forEach(expense => {
                        const createdAtDate = new Date(expense.createdAt);
                        const formattedDate = createdAtDate.toISOString().split('T')[0]; 
                        const listItem = document.createElement('li');
                        listItem.textContent = `Date: ${formattedDate}, Expense: ${expense.expense}, Category: ${expense.category}, Description: ${expense.description}`;
                        expenseList.appendChild(listItem);
                    });
                } else {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `No Data Found`;
                    expenseList.appendChild(listItem);
                }
            });
        };

        //to view daily expense
        function dailyExpense() {
            const dailyExpense = document.getElementById('dailyExpense');
            dailyExpense.style.visibility = 'visible';
            dailyExpense.addEventListener('click', async (e) => {
                const response = await axios.get('http://localhost:3000/expense/dailyExpense', { headers: { "Authorization": token } });
                if (response && response.data && response.data.data) {
                    dailyexpenseList.innerHTML = '';
                    response.data.data.forEach(expense => {
                        const createdAtDate = new Date(expense.createdAt);
                        const formattedDate = createdAtDate.toISOString().split('T')[0]; 
                        const listItem = document.createElement('li');
                        listItem.textContent = `Date: ${formattedDate}, Expense: ${expense.expense}, Category: ${expense.category}, Description: ${expense.description}`;
                        expenseList.appendChild(listItem);
                    });
                } else {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `No Data Found`;
                    dailyexpenseList.appendChild(listItem);
                }
            });
        };

        //to view yearly expenses
        function yearlyExpense() {
            const yearlyExpense = document.getElementById('yearlyExpense');
            yearlyExpense.style.visibility = 'visible';
            
            yearlyExpense.addEventListener('click', async (e) => {
                const response = await axios.get('http://localhost:3000/expense/yearlyExpense', { headers: { "Authorization": token } });
                if (response && response.data && response.data.data) {
                    yearlyexpenseList.innerHTML = '';
                    response.data.data.forEach(expense => {
                        const createdAtDate = new Date(expense.createdAt);
                        const formattedDate = createdAtDate.toISOString().split('T')[0]; 
                        const listItem = document.createElement('li');
                        listItem.textContent = `Date: ${formattedDate}, Expense: ${expense.expense}, Category: ${expense.category}, Description: ${expense.description}`;
                        expenseList.appendChild(listItem);
                    });
                } else {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `No Data Found`;
                    yearlyexpenseList.appendChild(listItem);
                }
            });
        };

        function addNewExpenses(e) {

            e.preventDefault();
            var category = 'others'
            if (e.target.category.value === '1') {
                category = 'fuel';
            } else if (e.target.category.value === '2') {
                category = 'medicine';
            }
            else if (e.target.category.value === '3') {
                category = 'groceries';
            }
            const expenseDetails = {
                expense: e.target.expense.value,
                description: e.target.description.value,
                category: category,
            }
            //sending post call to store details in database
            axios.post('http://localhost:3000/expense/addExpense', expenseDetails, { headers: { "Authorization": token } }).then((response) => {
                if (response.status === 201) {
                    //fetchDataFromDatabase(); //fetching the data from database (retrieving).

                } else {
                    console.log("err");
                }
            });
        };

        function fetchDataFromDatabase(page) { //function to get/fetch data from database
            const dynamicpagination = document.getElementById('dynamicpagination').value;
            var page = page || 1;
            axios.get(`http://localhost:3000/expense/getExpenses?page=${page}&items=${dynamicpagination}`, { headers: { "Authorization": token }, params: { size: dynamicpagination } }).then((response) => {

                showDataFromDatabase(response.data.expenses); //sending to function to display the data, check controller - how json is sending data to html
                showPagination(response.data);
            }).catch(err => console.log(err));
        }


        //pagination function to show buttons for pagination
        function showPagination({ currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage }) {
            const pagination = document.getElementById('pagination');
            pagination.innerHTML = '';
            if (hasPreviousPage) {
                const btn2 = document.createElement('button');
                btn2.innerHTML = previousPage;
                btn2.addEventListener('click', () => fetchDataFromDatabase(previousPage));
                pagination.appendChild(btn2);
            }

            const btn1 = document.createElement('button');
            btn1.innerHTML = `<h3>${currentPage}</h3>`;
            btn1.addEventListener('click', () => fetchDataFromDatabase(currentPage));
            pagination.appendChild(btn1);

            if (hasNextPage) {
                const btn3 = document.createElement('button');
                btn3.innerHTML = nextPage;
                btn3.addEventListener('click', () => fetchDataFromDatabase(nextPage));
                pagination.appendChild(btn3);
            }
        }

        function showDataFromDatabase(expense) { //function to display data
            const manifest = document.getElementById('manifest');
            manifest.innerHTML = '';
            expense.forEach((element) => {
                let string = `<li> Expense: ${element.expense} || Category: ${element.category} || Description: ${element.description} || <button onclick="deleteExpense(${element.id})"> Delete </button> </li>`;
                manifest.innerHTML += string;
            });
        }


        //function to delete the expense from database
        async function deleteExpense(id) {
            const response = await axios.delete(`http://localhost:3000/expense/deleteExpense/${id}`, { headers: { "Authorization": token } });
            if (response.status === 204) {
                fetchDataFromDatabase();
                console.log("Deleted");
            } else {
                const errorDiv = document.getElementsByClassName('errorDiv');
                errorDiv.innerHTML = ` <p style="color:red;"> Error Deleting, User UnAuthorized!! </p> `;
            }
        }


        //buy premium functionality
        document.getElementById('razorPayButton').addEventListener('click', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: { "Authorization": token } });
            var options = {
                "key": response.data.key_id,
                "order_id": response.data.order.id,
                "handler": async function (response) {
                    const responseOfAxiosPost = await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
                        order_id: options.order_id,
                        payment_id: response.razorpay_payment_id
                    }, { headers: { "Authorization": token } });
                    //console.log(">>>> response.data.token from axios.get to premiummembership",response.data.token);
                    alert("You are a premium user now");
                    document.getElementById('premiumUserMessage').innerHTML = `<p style="color:gold;">Premium User</p>`;
                    document.getElementById('razorPayButton').style.visibility = 'hidden';


                    localStorage.setItem('token', responseOfAxiosPost.data.token)


                },

            };

            const rzp1 = new Razorpay(options);
            rzp1.open(); //this will open our page from razorpays page
            //e.preventDefault();
            rzp1.on('payment.failed', function (response) {
                console.log(response);
                alert('something went wrong');
            });

        });

        document.getElementById('dynamicpagination').addEventListener('change', () => {
        fetchDataFromDatabase(); // Call the function to fetch data immediately when the dropdown value changes
        });


        fetchDataFromDatabase();//calling function (function call).