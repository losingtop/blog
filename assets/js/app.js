const content = document.querySelector('main > div.content');

(async () => {    
    await loadContent(window.location.hash)
    
    addEventListener("hashchange", async () => {
        await loadContent(window.location.hash)
    })
})()

async function loadContent(urlPath) {
    content.textContent = ''
    const p = document.createElement('p')
    
    if (!urlPath) {
        p.innerText = 'default page, wip'
        return content.append(p)
        //TODO: show latest posts and other stuff
    }
    
    if (urlPath.startsWith('#/post')) {
        const postId = urlPath.replace('#/post/', '')
        if (!postId) {
            p.innerText = 'no postId specified'
            return content.append(p)
        }

        const res = await fetch(`https://blog-api.losing.top/post?postId=${postId}`)
            .catch(() => {
                p.innerText = 'something went wrong'
                content.append(p)
            })

        const post = await res.json()

        if (post.error) {
            p.innerText = 'post not found'
            return content.append(p)
        }

        const title = document.querySelector('head > title')
        title.innerText = `${post.title} | losing's blog`

        const template = document.querySelector('template#post')
        const postElement = template.content.cloneNode(true)

        if (post?.tags) {
            const tagsWrapper = postElement.querySelector('.tags')

            for (const tag of post.tags) {
                const tagElement = document.createElement('a')
                tagElement.classList.add('tag')
                tagElement.setAttribute('href', `/#/tag/${tag}`)
                tagElement.innerText = tag
                tagsWrapper.append(tagElement)
            }
        } else
            postElement.querySelector('.tags').remove()

        post?.image ? postElement.querySelector('.image').setAttribute('src', post.image) : postElement.querySelector('.image').remove()
        postElement.querySelector('.title').innerText = post.title
        post?.description ? postElement.querySelector('.description').innerText = post.description : postElement.querySelector('.description').remove()
        postElement.querySelector('.details').innerText = `By ${post.author.displayName}`
        postElement.querySelector('.dates').innerText = `Created: ${new Date(post.createdDate).toLocaleDateString()} ${new Date(post.createdDate).toLocaleTimeString()}\n Changed: ${new Date(post.updatedDate).toLocaleDateString()} ${new Date(post.updatedDate).toLocaleTimeString()}`
        postElement.querySelector('.content').innerHTML = marked.parse(post.content)

        const wrapper = document.createElement('div')
        wrapper.classList.add('post')

        wrapper.append(postElement)
        content.append(wrapper)
    } else if (urlPath.startsWith('#/tag')) {
        const tagName = urlPath.replace('#/tag/', '')
        if (!tagName) {
            p.innerText = 'no tagName specified'
            return content.append(p)
        }

        const res = await fetch(`https://blog-api.losing.top/tag?tagName=${tagName}`)
            .catch(() => {
                p.innerText = 'something went wrong'
                content.append(p)
            })

        const tag = await res.json()

        if (tag.error) {
            p.innerText = 'tag not found'
            return content.append(p)
        }

        p.innerText = JSON.stringify(tag)
        content.append(p)
    }  else if (urlPath.startsWith('#/author')) {
        const authorId = urlPath.replace('#/author/', '')
        if (!authorId) {
            p.innerText = 'no authorId specified'
            return content.append(p)
        }

        const res = await fetch(`https://blog-api.losing.top/author?authorId=${authorId}`)
            .catch(() => {
                p.innerText = 'something went wrong'
                content.append(p)
            })

        const author = await res.json()

        if (author.error) {
            p.innerText = 'author not found'
            return content.append(p)
        }

        p.innerText = JSON.stringify(author)
        content.append(p)
    } else {
        const p = document.createElement('p')
        p.innerText = 'not found'
        content.append(p)
    }
}
