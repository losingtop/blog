const head = document.querySelector('head');
const title = head.querySelector('title');
const content = document.querySelector('main > div.content');
const footerTextElement = document.querySelector('footer > p');
const footerText = footerTextElement.innerText;

(async () => {    
    await loadContent(window.location.hash)
    
    addEventListener("hashchange", async () => {
        await loadContent(window.location.hash)
    })
})()

async function loadContent(urlPath) {
    content.textContent = ''
    const p = document.createElement('p')
    
    const startDate = new Date()
    
    if (window.location.pathname?.startsWith('/%23'))
        urlPath = window.location.pathname
            .replace('/%23', '#')
    
    if (!urlPath || urlPath === '#' || urlPath === '#/') {
        title.innerText = `losing's blog`
        
        const metaTags = `<meta property="og:title" content="losing's blog" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://blog.losing.top/" />
<meta property="og:image" content="https://u.losing.top/ik5h" />

<meta name="description" content="a blog where i write some interesting stuff about tech (and maybe more).">
<meta name="keywords" content="losing, blog, devlog, developer, coder, codelog, devblog, codeblog, tech, techblog, techlog">
<meta name="author" content="losing">
    `
        head.innerHTML += metaTags
        
        const recentPostsHeading = document.createElement('h2')
        recentPostsHeading.classList.add('sectionHeading')
        recentPostsHeading.innerText = `Recent posts`
       
        const res = await fetch(`https://blog-api.losing.top/posts`)
            .catch(() => {
                title.innerText = `Error | losing's blog`
                p.innerText = 'something went wrong'
                footerTextElement.innerText = footerText.replaceAll('{pageLoadMs}', (new Date).getTime() - startDate.getTime())
                content.append(p)
                return content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
            })
                
        const { posts } = await res.json()
        
        const postsWrapper = document.createElement('div')
        postsWrapper.classList.add('postsWrapper')
        
        for (post in posts) {
            const template = document.querySelector('template#postInfo')
            const postElement = template.content.cloneNode(true)
            
            if (posts[post]?.tags) {
                const tagsWrapper = postElement.querySelector('.tags')

                for (const tag of posts[post].tags) {
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

            if (posts[post].author?.avatar) {
                const authorAvatar = document.createElement('img')
                authorAvatar.classList.add('authorAvatar')
                authorAvatar.setAttribute('src', posts[post].author.avatar)
                authorAvatar.setAttribute('alt', `${posts[post].author.displayName}'s avatar`)
                postElement.querySelector('.author').append(authorAvatar)
            }

            const authorName = document.createElement('a')
            authorName.classList.add('authorNameLink')
            authorName.setAttribute('href', `/#/author/${posts[post].author.authorId}`)
            authorName.innerText = posts[post].author.displayName
            postElement.querySelector('.author').append(authorName)

            const createdDateAndTime = `${new Date(posts[post].createdDate).toLocaleDateString()} ${new Date(posts[post].createdDate).toLocaleTimeString()}`
            const updatedDateAndTime = `${new Date(posts[post].updatedDate).toLocaleDateString()} ${new Date(posts[post].updatedDate).toLocaleTimeString()}`

            posts[post]?.image ? postElement.querySelector('.image').setAttribute('src', posts[post].image) : postElement.querySelector('.image').remove()
            postElement.querySelector('.title').innerText = posts[post].title
            postElement.querySelector('.title').setAttribute('href', `/#/post/${posts[post].postId}`)
            posts[post]?.description ? postElement.querySelector('.description').innerText = posts[post].description : postElement.querySelector('.description').remove()
            postElement.querySelector('.dates').innerText = (posts[post].updatedDate > posts[post].createdDate ? `Updated at ${updatedDateAndTime}` : `Created at ${createdDateAndTime}`)
            
            const wrapper = document.createElement('div')
            wrapper.classList.add('postInfo')

            wrapper.append(postElement)
            postsWrapper.append(wrapper)
        }
        
        content.append(recentPostsHeading)
        content.append(postsWrapper)
    } else if (urlPath.startsWith('#/post')) {
        const postId = urlPath.replace('#/post/', '')
        if (!postId) {
            title.innerText = `Not Found | losing's blog`
            p.innerText = 'no postId specified'
            footerTextElement.innerText = footerText.replaceAll('{pageLoadMs}', (new Date).getTime() - startDate.getTime())
            content.append(p)
            return content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
        }

        const res = await fetch(`https://blog-api.losing.top/post?postId=${postId}`)
            .catch(() => {
                title.innerText = `Error | losing's blog`
                
                const metaTags = `<meta property="og:title" content="Error | losing's blog" />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://blog.losing.top/#/post/${postId}" />
<meta property="og:image" content="https://u.losing.top/ik5h" />
    `
        
                head.innerHTML += metaTags
                
                p.innerText = 'something went wrong'
                footerTextElement.innerText = footerText.replaceAll('{pageLoadMs}', (new Date).getTime() - startDate.getTime())
                content.append(p)
                return content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
            })

        const post = await res.json()

        if (post.error) {
            title.innerText = `Not Found | losing's blog`
            
            const metaTags = `<meta property="og:title" content="Not Found | losing's blog" />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://blog.losing.top/#404" />
<meta property="og:image" content="https://u.losing.top/ik5h" />
    `
        
            head.innerHTML += metaTags
            
            p.innerText = 'post not found'
            footerTextElement.innerText = footerText.replaceAll('{pageLoadMs}', (new Date).getTime() - startDate.getTime())
            content.append(p)
            return content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
        }
        
        title.innerText = `${post.title} | losing's blog`
        
        const metaTagsTemplate = `<meta property="og:title" content="{postTitle} | losing's blog" />
<meta property="og:type" content="article" />
<meta property="og:url" content="{postLink}" />
<meta property="og:image" content="{postImage}" />

<meta name="description" content="{postDescription}">
<meta name="keywords" content="{postTags}">
<meta name="author" content="{postAuthor}">
    `
        const metaTags = metaTagsTemplate
            .replaceAll('{postTitle}', post.title)
            .replaceAll('{postLink}', `https://blog.losing.top/#/post/${post.postId}`)
            .replaceAll('{postImage}', post.image)
            .replaceAll('{postDescription}', post.description)
            .replaceAll('{postTags}', post.tags.join(', '))
            .replaceAll('{postAuthor}', post.author.displayName)
        
        head.innerHTML += metaTags

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
        postElement.querySelector('.content').innerHTML = post.htmlContent

        const wrapper = document.createElement('div')
        wrapper.classList.add('post')

        wrapper.append(postElement)
        content.append(wrapper)
    } else if (urlPath.startsWith('#/tag')) {
        const tagName = urlPath.replace('#/tag/', '')
        if (!tagName) {
            title.innerText = `Not Found | losing's blog`
            p.innerText = 'no tagName specified'
            footerTextElement.innerText = footerText.replaceAll('{pageLoadMs}', (new Date).getTime() - startDate.getTime())
            content.append(p)
            return content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
        }

        const res = await fetch(`https://blog-api.losing.top/tag?tagName=${tagName}`)
            .catch(() => {
                title.innerText = `Error | losing's blog`
                
                const metaTags = `<meta property="og:title" content="Error | losing's blog" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://blog.losing.top/#/tag/${tagName}" />
<meta property="og:image" content="https://u.losing.top/ik5h" />

<meta name="description" content="View posts with the ${tagName} tag.">
<meta name="keywords" content="${tagName}, losing, blog">
    `
        
                head.innerHTML += metaTags
                
                p.innerText = 'something went wrong'
                footerTextElement.innerText = footerText.replaceAll('{pageLoadMs}', (new Date).getTime() - startDate.getTime())
                content.append(p)
                return content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
            })

        const tag = await res.json()

        if (tag.error) {
            title.innerText = `Not Found | losing's blog`
            
            const metaTags = `<meta property="og:title" content="Not Found | losing's blog" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://blog.losing.top/#404" />
<meta property="og:image" content="https://u.losing.top/ik5h" />
    `
        
            head.innerHTML += metaTags
            
            p.innerText = 'tag not found'
            footerTextElement.innerText = footerText.replaceAll('{pageLoadMs}', (new Date).getTime() - startDate.getTime())
            content.append(p)
            return content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
        }
        
        title.innerText = `Tag ${tag.tagName} | losing's blog`
        
        const metaTagsTemplate = `<meta property="og:title" content="Tag {tagName} | losing's blog" />
<meta property="og:type" content="website" />
<meta property="og:url" content="{tagLink}" />
<meta property="og:image" content="https://u.losing.top/ik5h" />
    `
        const metaTags = metaTagsTemplate
            .replaceAll('{tagName}', tag.tagName)
            .replaceAll('{tagLink}', `https://blog.losing.top/#/tag/${tag.tagName}`)
        
        head.innerHTML += metaTags

        const template = document.querySelector('template#tag')
        const tagElement = template.content.cloneNode(true)
        
        const tagElementName = tagElement.querySelector('.tagDetails > .right > h1.name')
        tagElementName.innerText = `Tag ${tag.tagName}`
        
        const tagElementPostsCount = tagElement.querySelector('.tagDetails > .right > p.postsCount')
        tagElementPostsCount.innerText = `${tag.postsCount} total posts`

        const wrapper = document.createElement('div')
        wrapper.classList.add('tag')
        wrapper.append(tagElement)
        content.append(wrapper)
        
        const { posts } = tag

        const postsWrapper = document.createElement('div')
        postsWrapper.classList.add('postsWrapper')
        content.append(postsWrapper)
        
        let i = 0

        for (post in posts) {
            const template = document.querySelector('template#postInfo')
            const postElement = template.content.cloneNode(true)

            i++
            
            if (posts[post]?.tags) {
                const tagsWrapper = postElement.querySelector('.tags')

                for (const tag of posts[post].tags) {
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

            if (posts[post].author?.avatar) {
                const authorAvatar = document.createElement('img')
                authorAvatar.classList.add('authorAvatar')
                authorAvatar.setAttribute('src', posts[post].author.avatar)
                authorAvatar.setAttribute('alt', `${posts[post].author.displayName}'s avatar`)
                postElement.querySelector('.author').append(authorAvatar)
            }

            const authorName = document.createElement('a')
            authorName.classList.add('authorNameLink')
            authorName.setAttribute('href', `/#/author/${posts[post].author.authorId}`)
            authorName.innerText = posts[post].author.displayName
            postElement.querySelector('.author').append(authorName)
            
            const createdDateAndTime = `${new Date(posts[post].createdDate).toLocaleDateString()} ${new Date(posts[post].createdDate).toLocaleTimeString()}`
            const updatedDateAndTime = `${new Date(posts[post].updatedDate).toLocaleDateString()} ${new Date(posts[post].updatedDate).toLocaleTimeString()}`

            posts[post]?.image ? postElement.querySelector('.image').setAttribute('src', posts[post].image) : postElement.querySelector('.image').remove()
            postElement.querySelector('.title').innerText = posts[post].title
            postElement.querySelector('.title').setAttribute('href', `/#/post/${posts[post].postId}`)
            posts[post]?.description ? postElement.querySelector('.description').innerText = posts[post].description : postElement.querySelector('.description').remove()
            postElement.querySelector('.dates').innerText = (posts[post].updatedDate > posts[post].createdDate ? `Updated at ${updatedDateAndTime}` : `Created at ${createdDateAndTime}`)

            const wrapper = document.createElement('div')
            wrapper.classList.add('postInfo')
            wrapper.append(postElement)
            postsWrapper.append(wrapper)
        }
    }  else if (urlPath.startsWith('#/author')) {
        const authorId = urlPath.replace('#/author/', '')
        if (!authorId) {
            title.innerText = `Not Found | losing's blog`
            p.innerText = 'no authorId specified'
            footerTextElement.innerText = footerText.replaceAll('{pageLoadMs}', (new Date).getTime() - startDate.getTime())
            content.append(p)
            return content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
        }

        const res = await fetch(`https://blog-api.losing.top/author?authorId=${authorId}`)
            .catch(() => {
                title.innerText = `Error | losing's blog`
                
                const metaTags = `<meta property="og:title" content="Not Found | losing's blog" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://blog.losing.top/#404" />
<meta property="og:image" content="https://u.losing.top/ik5h" />
    `
        
                head.innerHTML += metaTags
                
                p.innerText = 'something went wrong'
                footerTextElement.innerText = footerText.replaceAll('{pageLoadMs}', (new Date).getTime() - startDate.getTime())
                content.append(p)
                return content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
            })

        const author = await res.json()

        if (author.error) {
            title.innerText = `Not Found | losing's blog`
            
            const metaTags = `<meta property="og:title" content="Error | losing's blog" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://blog.losing.top/#/author/${authorId}" />
<meta property="og:image" content="https://u.losing.top/ik5h" />
    `
        
            head.innerHTML += metaTags
            
            p.innerText = 'author not found'
            footerTextElement.innerText = footerText.replaceAll('{pageLoadMs}', (new Date).getTime() - startDate.getTime())
            content.append(p)
            return content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
        }
        
        title.innerText = `Author ${author.displayName} | losing's blog`
        
        const metaTagsTemplate = `<meta property="og:title" content="Author {authorName} | losing's blog" />
<meta property="og:type" content="website" />
<meta property="og:url" content="{authorLink}" />
<meta property="og:image" content="{authorAvatar}" />

<meta name="description" content="{authorDescription}">
<meta name="keywords" content="{authorName}, losing, blog">
<meta name="author" content="{authorName}">
    `
        const metaTags = metaTagsTemplate
            .replaceAll('{authorName}', author.displayName)
            .replaceAll('{authorLink}', `https://blog.losing.top/#/author/${author.authorId}`)
            .replaceAll('{authorAvatar}', author.avatar)
            .replaceAll('{authorDescription}', author.description)
        
        head.innerHTML += metaTags

        const template = document.querySelector('template#author')
        const authorElement = template.content.cloneNode(true)
        
        if (author?.avatar) {
            const authorAvatar = authorElement.querySelector('.authorDetails > img')
            authorAvatar.setAttribute('src', author.avatar)
            authorAvatar.setAttribute('alt', `${author.displayName}'s avatar`)
        }
        
        const authorName = authorElement.querySelector('.authorDetails > .right > h1.name')
        authorName.innerText = author.displayName
        
        const authorDescription = authorElement.querySelector('.authorDetails > .right > p.description')
        authorDescription.innerText = author.description
        
        const authorPostsCount = authorElement.querySelector('.authorDetails > .right > p.postsCount')
        authorPostsCount.innerText = `${author.postsCount} total posts`

        const wrapper = document.createElement('div')
        wrapper.classList.add('author')
        wrapper.append(authorElement)
        content.append(wrapper)
        
        content.append(wrapper)
        
        const { posts } = author

        const postsWrapper = document.createElement('div')
        postsWrapper.classList.add('postsWrapper')
        content.append(postsWrapper)
        
        let i = 0

        for (post in posts) {
            const template = document.querySelector('template#postInfo')
            const postElement = template.content.cloneNode(true)

            i++
            
            if (posts[post]?.tags) {
                const tagsWrapper = postElement.querySelector('.tags')

                for (const tag of posts[post].tags) {
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

            if (posts[post].author?.avatar) {
                const authorAvatar = document.createElement('img')
                authorAvatar.classList.add('authorAvatar')
                authorAvatar.setAttribute('src', posts[post].author.avatar)
                authorAvatar.setAttribute('alt', `${posts[post].author.displayName}'s avatar`)
                postElement.querySelector('.author').append(authorAvatar)
            }

            const authorName = document.createElement('a')
            authorName.classList.add('authorNameLink')
            authorName.setAttribute('href', `/#/author/${posts[post].author.authorId}`)
            authorName.innerText = posts[post].author.displayName
            postElement.querySelector('.author').append(authorName)
            
            const createdDateAndTime = `${new Date(posts[post].createdDate).toLocaleDateString()} ${new Date(posts[post].createdDate).toLocaleTimeString()}`
            const updatedDateAndTime = `${new Date(posts[post].updatedDate).toLocaleDateString()} ${new Date(posts[post].updatedDate).toLocaleTimeString()}`

            posts[post]?.image ? postElement.querySelector('.image').setAttribute('src', posts[post].image) : postElement.querySelector('.image').remove()
            postElement.querySelector('.title').innerText = posts[post].title
            postElement.querySelector('.title').setAttribute('href', `/#/post/${posts[post].postId}`)
            posts[post]?.description ? postElement.querySelector('.description').innerText = posts[post].description : postElement.querySelector('.description').remove()
            postElement.querySelector('.dates').innerText = (posts[post].updatedDate > posts[post].createdDate ? `Updated at ${updatedDateAndTime}` : `Created at ${createdDateAndTime}`)

            const wrapper = document.createElement('div')
            wrapper.classList.add('postInfo')
            wrapper.append(postElement)
            postsWrapper.append(wrapper)
        }
    } else {
        title.innerText = `Not Found | losing's blog`
        
        const metaTags = `<meta property="og:title" content="Not Found | losing's blog" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://blog.losing.top/#404" />
<meta property="og:image" content="https://u.losing.top/ik5h" />
    `
        
        head.innerHTML += metaTags
        
        p.innerText = 'not found'
        content.append(p)
    }
    
    footerTextElement.innerText = footerText.replaceAll('{pageLoadMs}', (new Date).getTime() - startDate.getTime())
    content.animate([{ transform: "translateX(120vw)" }, { transform: "translateX(0)" }], { duration: 300, iterations: 1 })
}
