const title = document.querySelector('head > title');
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
    
    if (!urlPath || urlPath === "#" || urlPath === "#/") {
        title.innerText = `losing's blog`
        p.innerText = 'default page, wip'
        content.append(p)
        return content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
        //TODO: show latest posts and other stuff
    } else if (urlPath.startsWith('#/post')) {
        const postId = urlPath.replace('#/post/', '')
        if (!postId) {
            title.innerText = `Not Found | losing's blog`
            p.innerText = 'no postId specified'
            content.append(p)
            return content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
        }

        const res = await fetch(`https://blog-api.losing.top/post?postId=${postId}`)
            .catch(() => {
                title.innerText = `Error | losing's blog`
                p.innerText = 'something went wrong'
                content.append(p)
                return content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
            })

        const post = await res.json()

        if (post.error) {
            title.innerText = `Not Found | losing's blog`
            p.innerText = 'post not found'
            content.append(p)
            return content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
        }
        
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
        
        const authorText = document.createElement('p')
        authorText.innerText = 'By '
        postElement.querySelector('.author').append(authorText)
        
        if (post.author?.avatar) {
            const authorAvatar = document.createElement('img')
            authorAvatar.classList.add('authorAvatar')
            authorAvatar.setAttribute('src', post.author.avatar)
            authorAvatar.setAttribute('alt', `${post.author.displayName}'s avatar`)
            postElement.querySelector('.author').append(authorAvatar)
        }
        
        const authorName = document.createElement('a')
        authorName.classList.add('authorNameLink')
        authorName.setAttribute('href', `/#/author/${post.author.authorId}`)
        authorName.innerText = post.author.displayName
        postElement.querySelector('.author').append(authorName)
        
        const createdDateAndTime = `${new Date(post.createdDate).toLocaleDateString()} ${new Date(post.createdDate).toLocaleTimeString()}`
        const updatedDateAndTime = `${new Date(post.updatedDate).toLocaleDateString()} ${new Date(post.updatedDate).toLocaleTimeString()}`
        
        post?.image ? postElement.querySelector('.image').setAttribute('src', post.image) : postElement.querySelector('.image').remove()
        postElement.querySelector('.title').innerText = post.title
        post?.description ? postElement.querySelector('.description').innerText = post.description : postElement.querySelector('.description').remove()
        postElement.querySelector('.dates').innerText = (post.updatedDate > post.createdDate ? `Updated at ${updatedDateAndTime}` : `Created at ${createdDateAndTime}`)
        postElement.querySelector('.content').innerHTML = marked.parse(post.content)

        const wrapper = document.createElement('div')
        wrapper.classList.add('post')

        wrapper.append(postElement)
        content.append(wrapper)
    } else if (urlPath.startsWith('#/tag')) {
        const tagName = urlPath.replace('#/tag/', '')
        if (!tagName) {
            title.innerText = `Not Found | losing's blog`
            p.innerText = 'no tagName specified'
            content.append(p)
            return content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
        }

        const res = await fetch(`https://blog-api.losing.top/tag?tagName=${tagName}`)
            .catch(() => {
                title.innerText = `Error | losing's blog`
                p.innerText = 'something went wrong'
                content.append(p)
                return content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
            })

        const tag = await res.json()

        if (tag.error) {
            title.innerText = `Not Found | losing's blog`
            p.innerText = 'tag not found'
            content.append(p)
            return content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
        }
        
        title.innerText = `Tag ${tag.tagName} | losing's blog`

        p.innerText = JSON.stringify(tag)
        content.append(p)
    }  else if (urlPath.startsWith('#/author')) {
        const authorId = urlPath.replace('#/author/', '')
        if (!authorId) {
            title.innerText = `Not Found | losing's blog`
            p.innerText = 'no authorId specified'
            content.append(p)
            return content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
        }

        const res = await fetch(`https://blog-api.losing.top/author?authorId=${authorId}`)
            .catch(() => {
                title.innerText = `Error | losing's blog`
                p.innerText = 'something went wrong'
                content.append(p)
                return content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
            })

        const author = await res.json()

        if (author.error) {
            title.innerText = `Not Found | losing's blog`
            p.innerText = 'author not found'
            content.append(p)
            return content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
        }
        
        title.innerText = `Author ${author.displayName} | losing's blog`

        const template = document.querySelector('template#author')
        const authorElement = template.content.cloneNode(true)
        
        if (author?.avatar) {
            const authorAvatar = authorElement.querySelector('.authorDetails > img')
            authorAvatar.setAttribute('src', author.avatar)
            authorAvatar.setAttribute('alt', `${author.displayName}'s avatar`)
        }
        
        const authorName = authorElement.querySelector('.authorDetails > .right > h1.name')
        authorName.innerText = author.displayName

        const wrapper = document.createElement('div')
        wrapper.classList.add('author')

        wrapper.append(authorElement)
        content.append(wrapper)
    } else {
        title.innerText = `Not Found | losing's blog`
        p.innerText = 'not found'
        content.append(p)
    }
    
    content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
}
