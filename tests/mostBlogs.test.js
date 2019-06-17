const listHelper = require('../utils/list_helpers')
const blogs = require('./testBlogs').blogs

describe('most blogs', () => {

    const most =
    {
        "author": "Robert C. Martin",
        "blogs": 3
    }
 
    test('the author with most blogs', () => {
        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual(most)
    })
})
