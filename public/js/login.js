const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const password = formData.get('password');

            //so to input fields get emptied once signed up.
            const EmptyNameField = document.getElementById('name');
            const EmptyEmailField = document.getElementById('email');
            const EmptyPasswordField = document.getElementById('password');

            try {
                const responseFromPost = await axios.post('http://localhost:3000/user/loggedin', {
                    name, email, password
                });

                const manifest = document.getElementById('manifest');

                if (responseFromPost.status === 200) {
                    manifest.innerHTML = `<p> Logged in Successful </p>`;
                    EmptyNameField.value = "" ; //field gets empty
                    EmptyEmailField.value = "" ; //field gets empty
                    EmptyPasswordField.value = "" ; //field gets empty
                    localStorage.setItem('token',responseFromPost.data.token); //storing token in local storage
                    window.location.href = `/expense/addExpense`;
                    
                } else {
                    manifest.innerHTML = `<p> Error in logging </p>`;
                    EmptyNameField.value = "" ; //field gets empty
                    EmptyEmailField.value = "" ; //field gets empty
                    EmptyPasswordField.value = "" ; //field gets empty
                }
            } catch (error) {
                const manifest = document.getElementById('manifest');
                manifest.innerHTML = `<p> Error in logging: ${error.response.data.error}</p>`;
                EmptyNameField.value = "" ; //field gets empty
                EmptyEmailField.value = "" ; //field gets empty
                EmptyPasswordField.value = "" ; //field gets empty
            }
        });

        const forgotPassword = document.getElementById('forgotPassword');
        forgotPassword.addEventListener('click',async ()=>{
            window.location.href='/user/password/forgotpassword'
        });