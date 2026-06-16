const cl = console.log;
const inputform = document.getElementById('inputform')
const title = document.getElementById('title')
const body = document.getElementById('body')
const userId = document.getElementById('userId')
const Addpost = document.getElementById('Addpost')
const Updatepost = document.getElementById('Updatepost')
const CardContainer = document.getElementById('CardContainer')
const spinner = document.getElementById('spinner')


let Base_Url = `https://jsonplaceholder.typicode.com`


let postArr =[]


function snackbar(msg,icon){
    swal.fire({
        title : msg,
        icon : icon,
        timer : 2000
    })
}

function fetchposts(){
    spinner.classList.remove('d-none')

    let Post_url =`${Base_Url}/posts`

    let xhr = new XMLHttpRequest()

    xhr.open('GET',Post_url)
    xhr.send(null)

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <=299){
            postArr = JSON.parse(xhr.response)

            createCards(postArr.reverse())
            $(function () {
                $('[data-toggle="tooltip"]').tooltip()
            })
        }
     spinner.classList.add('d-none')
    }
}

fetchposts()

function createCards(arr){
    let result =``
    arr.forEach(ele => {
        result+=`<div class="col-md-4 my-4" id='${ele.id}'>
					<div class="card h-100">
						<div class="card-header bg-primary text-white" data-toggle="tooltip" data-placement="top" title="${ele.title}">
							<h2>
                                ${ele.title}
							</h2>
						</div>
						<div class="card-body">
							<p class='font-weight-bold'>${ele.body}</p>
						</div>
						<div class="card-footer d-flex justify-content-between">
							<button class="btn btn-sm btn-success " onclick="Onedit(this)">Edit</button>
							<button class="btn btn-sm btn-danger " onclick="OnRemove(this)">Remove</button>
						</div>
					</div>
				</div>`
    });

    CardContainer.innerHTML = result

}


function onsubmit(ele){
    spinner.classList.remove('d-none')

    ele.preventDefault()

    let newObj = {
        title : title.value,
        body : body.value,
        userId : userId.value
    }

    let Post_url =`${Base_Url}/posts`

    let xhr = new XMLHttpRequest()

    xhr.open("POST",Post_url)

    xhr.send(newObj)

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <=299){
            let res = JSON.parse(xhr.response)

            createNewCard(newObj,res)
                        $(function () {
                $('[data-toggle="tooltip"]').tooltip()
            })

        }else{
            snackbar(xhr.status)

        }
        spinner.classList.add('d-none')
    }
}


function createNewCard(newObj,res){
    let div = document.createElement('div')
    div.className = `col-md-4 my-4`
    div.id = res.id

    div.innerHTML =`<div class="card h-100">
						<div class="card-header bg-primary text-white" data-toggle="tooltip" data-placement="top" title="${newObj.title}">
							<h2>
                                ${newObj.title}
							</h2>
						</div>
						<div class="card-body">
							<p class='font-weight-bold'>${newObj.body}</p>
						</div>
						<div class="card-footer d-flex justify-content-between">
							<button class="btn btn-sm btn-success " onclick="Onedit(this)">Edit</button>
							<button class="btn btn-sm btn-danger " onclick="OnRemove(this)">Remove</button>
						</div>
					</div>`

    CardContainer.prepend(div)

    inputform.reset()

    snackbar(`The New Post Id ${res.id} is Added Successfully!!`,'success')
}


function Onedit(ele){
    spinner.classList.remove('d-none')  

    let EditId  = ele.closest('.col-md-4').id
    localStorage.setItem('EditId',EditId)
    let Edit_url = `${Base_Url}/posts/${EditId}`

    let xhr = new XMLHttpRequest()

    xhr.open('GET',Edit_url)

    xhr.send(null)

    xhr.onload = function () {
        if(xhr.status >= 200 && xhr.status <=299){
            let editObj = JSON.parse(xhr.response)

            title.value = editObj.title
            body.value = editObj.body
            userId.value = editObj.userId

            Addpost.classList.add('d-none')
            Updatepost.classList.remove('d-none')
            inputform.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        }else{
            snackbar(xhr,'error')
        }
        spinner.classList.add('d-none')

    }


}


function onupdate(){
    spinner.classList.remove('d-none')
    let updateId = localStorage.getItem('EditId')

    let udpateObj ={
        title : title.value,
        body : body.value,
        userId : userId.value,
        id : updateId
    }

    let update_url = `${Base_Url}/posts/${updateId}`

    let xhr = new XMLHttpRequest()

    xhr.open('PUT',update_url)

    xhr.send(udpateObj)

    xhr.onload = function () {
        if(xhr.status >= 200 && xhr.status <= 299){

            let div = document.getElementById(updateId)

            let h2 = div.querySelector('.card-header h2')

            h2.innerText = udpateObj.title

            let p = div.querySelector('.card-body p')

            p.innerText = udpateObj.body


            inputform.reset()

            Addpost.classList.remove('d-none')
            Updatepost.classList.add('d-none')
            snackbar(`The Post Id ${updateId} is Updated Successfully!!`,'success')

            div.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            div.classList.add('highlight');

            setTimeout(() => {
                div.classList.remove('highlight');
            }, 4000);

        }else{
            snackbar(xhr,'error')
        }
        spinner.classList.add('d-none')
    }
}


function OnRemove(ele){
    let removeId = ele.closest('.col-md-4').id

    Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed){
        spinner.classList.remove('d-none')

            let remove_Url = `${Base_Url}/posts/${removeId}`

            let xhr = new XMLHttpRequest()

            xhr.open('DELETE',remove_Url)

            xhr.send(null)

            xhr.onload = function (){
                if(xhr.status >= 200 && xhr.status <=299){

                    ele.closest('.col-md-4').remove()

                snackbar(`The Post Id ${removeId} is Removed Successfully!!`,'success')

                }
                spinner.classList.add('d-none')

            }
        }
    });
}

inputform.addEventListener('submit',onsubmit)
Updatepost.addEventListener('click',onupdate)
