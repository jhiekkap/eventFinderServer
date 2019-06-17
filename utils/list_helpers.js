var _ = require('lodash')

const dummy = blogs => {
    return 1
}

const totalLikes = blogs => {
    const reducer = (sum, item) => {
        return sum + item
    }
    return blogs
        .map(blog => blog.likes)
        .reduce(reducer, 0)
}

const favoriteBlog = blogs => {
    let likesList = blogs.map(blog => blog.likes)
    //console.log('LIKESLIST: ', likesList) likesList = [ 7, 5, 12, 10, 0, 2 ]
    let max = Math.max(...likesList)
    //console.log('MAX: ', max) let max = 12
    let favorites = blogs.filter(blog => blog.likes === max)
    //console.log('FAVORITES: ', favorites)
    return favorites[0]
}

const mostBlogs = blogs => {

    let howMany = _.countBy(blogs, 'author')
    //console.log('MONTAKO: ', howMany)
    /* let uniqueList = Object.entries(howMany)
    console.log('UNIIKKI LISTA: ', uniqueList)*/
    let uList = []
    Object
        .entries(howMany)
        .forEach(entry => {
            let key = entry[0]
            let value = entry[1]
            uList.push({author: key, blogs: value})
        });
    //console.log('UNIIKKI LISTA:', uList)

    /* let authors = blogs.map(blog => blog.author)

    let uniqueAuthors = []
    for (let author of authors) {
        if (!uniqueAuthors.includes(author)) {
            uniqueAuthors.push(author)
        }
    }
    let uList = []
    for (let uAuthor of uniqueAuthors) {
        let sum = 0
        for (let author of authors) {
            if (author === uAuthor) {
                sum++
            }
        }
        uList.push({
            author: uAuthor,
            blogs: sum
        })
    }
    console.log('UNIIKKI LISTA: ',uList) */
    let howManyList = uList.map(blogger => blogger.blogs)
    //console.log('HOWMANYLIST: ', howManyList)
    let max = Math.max(...howManyList)
    let mostBloggers = uList.filter(blogger => blogger.blogs === max)
    return mostBloggers[0]
}

const mostLikes = blogs => {

    let authorsAndLikes = []
    blogs.forEach(blog => {
        authorsAndLikes.push({author: blog.author, likes: blog.likes})
    })
    //console.log('AUTHORS AND LIKES:', authorsAndLikes)

    let howMany = _.countBy(authorsAndLikes, 'author')
    //console.log('HOW MANY:', howMany)
    let authors = _.uniq(blogs.map(blog => blog.author))
    //console.log('AUTHORS: ', authors)
    let uniqueAuthorsAndLikes = []
    authors.forEach(author => {
        let sum = 0
        blogs.forEach(blog => {
            if (blog.author === author) {
                sum += blog.likes
            }
        })
        uniqueAuthorsAndLikes.push({author: author, likes: sum})
    })
    //console.log('UNIQUE AUTHORS AND LIKES: ', uniqueAuthorsAndLikes)
    let howManyList = uniqueAuthorsAndLikes.map(blogger => blogger.likes)
    //console.log('HOWMANYLIST: ', howManyList)
    let max = Math.max(...howManyList)
    let mostLikedBloggers = uniqueAuthorsAndLikes.filter(blogger => blogger.likes === max)

    return mostLikedBloggers[0]
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}