const {mysqlDb} = require("../db");
const SnowFlakeId = require("../utils/SnowFlakeIdGenerator");
const dateFunction = require("../utils/Date");
const LZString = require("lz-string");

// 新增帖子
const insertBlog = (
    id,
    title,
    content,
    category_id,
    coverUrl,
    publisher_id,
    create_time,
    callback
) => {
    const sql =
        "INSERT INTO blog SET id=?, title=?, content=?, category_id=?, coverUrl=?, publisher_id=?, create_time=? ";
    mysqlDb.query(
        sql,
        [id, title, content, category_id, coverUrl, publisher_id, create_time],
        (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, result);
        }
    );
};

// 新增评论
const insertComment = (
    id,
    content,
    publisher_id,
    nickname,
    bn_id,
    pid,
    pname,
    category,
    create_time,
    callback
) => {
    const sql =
        "INSERT INTO comment SET id=?, content=?, publisher_id=?, nickname=?, bn_id=?, pid=?, pname=?, `like`=0, category=?, create_time=? ";
    mysqlDb.query(
        sql,
        [
            id,
            content,
            publisher_id,
            nickname,
            bn_id,
            pid,
            pname,
            category,
            create_time,
        ],
        (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, result);
        }
    );
};

// 点赞
const likeBlog = (comment_id, callback) => {
    const sql = "UPDATE comment SET `like` = `like` + 1 WHERE id = ?;";
    mysqlDb.query(sql, [comment_id], (err, result) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, result);
    });
};

// 删除
const deleteBlog = (id, callback) => {
    const sql = "DELETE FROM blog WHERE id = ? ";
    mysqlDb.query(sql, [id], (err, result) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, result);
    });
};

// 查询--条件筛选
const getBlog = (
    page,
    pageSize,
    categoryId,
    keyword,
    create_time,
    callback
) => {
    let sqlParams = [];
    let sqlCondition = [];

    if (categoryId != 0) {
        sqlCondition.push(" category_id = ? ");
        sqlParams.push(categoryId);
    }

    if (keyword != "") {
        sqlCondition.push(" (title LIKE ? OR content LIKE ?) ");
        sqlParams.push("%" + keyword + "%");
        sqlParams.push("%" + keyword + "%");
    }

    if (create_time != "") {
        sqlCondition.push(" DATE(create_time) = ? ");
        sqlParams.push(create_time);
    }

    let whereSqlStr = "";
    if (sqlCondition.length > 0) {
        whereSqlStr = " WHERE " + sqlCondition.join(" AND ");
    }

    let sql;

    if (pageSize !== null) {
        sql = " SELECT * FROM blog " + whereSqlStr + " LIMIT ?,? ";
    } else if (page == 1 && pageSize == null) {
        sql = " SELECT * FROM blog " + whereSqlStr;
    }

    let params = sqlParams.concat([(page - 1) * pageSize, parseInt(pageSize)]);

    let blogArr = [];
    let total;

    mysqlDb.query(sql, params, (err, result) => {
        if (err) {
            callback(err, null);
            return;
        }

        blogArr = result;

        if (page == 1 && pageSize == null) {
            callback(null, blogArr);
        } else {
            let sql2 = " SELECT count(*) AS total FROM blog " + whereSqlStr;

            mysqlDb.query(sql2, sqlParams, (err, result) => {
                if (err) {
                    callback(err, null);
                    return;
                }
                total = result[0].total;
                callback(null, {blogArr, total});
            });
        }
    });
};

// 查询--通过id
const getBlogById = (id, callback) => {
    const sql = "SELECT * FROM blog WHERE id = ? ";
    mysqlDb.query(sql, [id], (err, result) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, result[0]);
    });
};

// 查询--分类
const getBlogCategories = (callback) => {
    const sql = "SELECT * FROM blog_categories";
    mysqlDb.query(sql, (err, result) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, result);
    });
};

// 查询--通过id查询帖子评论
const getBlogCommentsById = (id, callback) => {
    const sql = "SELECT * FROM comment WHERE bn_id = ? AND category = 'blog' ";
    mysqlDb.query(sql, [id], (err, result) => {
        if (err) {
            callback(err, null);
            return;
        }

        let rootComments = result.filter((comment) => comment.pid === null);

        function buildCommentTree(comments, parentId) {
            // 筛选出所有父ID为当前ID的评论
            let children = comments.filter((c) => c.pid === parentId);
            // 递归地为每个筛选出的评论构建子树
            children.forEach((child) => {
                child.children = buildCommentTree(comments, child.id); // 递归调用自身构建子评论
            });
            // 返回构建好的子评论数组
            return children;
        }

        // 假设result是你的所有评论的数组，并且每个评论都有pid和id属性
        // 首先，构建顶级评论的树
        rootComments.forEach((rootComment) => {
            rootComment.children = buildCommentTree(result, rootComment.id); // 调用递归函数构建子评论
        });

        let sql2 = " SELECT count(*) FROM comment WHERE bn_id = ?";
        mysqlDb.query(sql2, [id], (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }
            let total = result[0]["count(*)"];
            callback(null, {comments: rootComments, total});
        });
    });
};

// 新增--帖子分类
const insertBlogCategories = (name, state, callback) => {
    const snowFlakeId = new SnowFlakeId({WorkerId: 1});
    const id = snowFlakeId.NextId();

    const sql = "INSERT INTO blog_categories SET id=?, name=?, state=?";
    mysqlDb.query(sql, [id, name, state], (err, result) => {
        if (err) {
            callback(err, null);
            return;
        }
        console.log(result);
        callback(null, result);
    });
};

// 查询帖子各分类数量
const getBlogCategoriesCount = (callback) => {
    const sql = "SELECT category_id, COUNT(*) AS count FROM blog GROUP BY category_id";
    mysqlDb.query(sql, (err, result) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, result);
    });
};

module.exports = {
    insertBlog,
    insertComment,
    likeBlog,
    deleteBlog,
    getBlog,
    getBlogById,
    getBlogCategories,
    getBlogCommentsById,
    insertBlogCategories,
    getBlogCategoriesCount,
};
