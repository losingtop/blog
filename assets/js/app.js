const urlParams = new URLSearchParams(window.location.search)
const postId = urlParams.get('post')

const main = document.querySelector('main')

if (postId) {
    const p = document.createElement('p')

    fetch(`http://dono-01.danbot.host:1451/post?postId=${postId}`)
        .catch(() => {
            p.innerText = 'something went wrong'
            document.body.append(p)
        })
        .then(res => res.json())
        .then(callback)

    function callback(post) {
        console.log(post)

        if (post.error) {
            p.innerText = 'post not found'
            return document.body.append(p)
        }

        const title = document.querySelector('head > title')
        title.innerText = `${post.title} | losing's blog`

        const template = document.querySelector('template#post')
        const postElement = template.content.cloneNode(true)

        post?.image ? postElement.querySelector('.image').setAttribute('src', post.image) : postElement.querySelector('.image').remove()
        postElement.querySelector('.title').innerText = post.title
        post?.description ? postElement.querySelector('.description').innerText = post.description : postElement.querySelector('.description').remove()
        postElement.querySelector('.details').innerText = `By ${post.author.displayName} | Tags: ${post.tags}`
        postElement.querySelector('.dates').innerText = `Created: ${new Date(post.createdDate).toLocaleDateString()} ${new Date(post.createdDate).toLocaleTimeString()}\n Changed: ${new Date(post.updatedDate).toLocaleDateString()} ${new Date(post.updatedDate).toLocaleTimeString()}`
        postElement.querySelector('.content').innerHTML = marked.parse(post.content)

        const wrapper = document.createElement('div')
        wrapper.classList.add('post')

        wrapper.append(postElement)
        main.append(wrapper)
    }
}
