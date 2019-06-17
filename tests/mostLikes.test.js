const listHelper = require('../utils/list_helpers')
const blogs = require('./testBlogs').blogs

describe('most likes', () => {

    const mostLiked =
    {
        "author": "Edsger W. Dijkstra",
        "likes": 17
    }

    test('the most liked blogger', () => {
        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual(mostLiked)
    })
})