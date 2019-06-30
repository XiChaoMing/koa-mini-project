const Router = require('koa-router');
const router = new Router({
    prefix: '/v1/classic'
});
const { PositiveIntegerValidator, ClassicValidator } = require('../../validator/validator');
const { Auth } = require('../../../middlewares/auth');
const { Flow } = require('../../models/flow');
const { Art } = require('../../models/art');
const { Favor } = require('../../models/favor');
const { NotFound } = require('../../../core/http-exception');

// 获取最新期刊
router.get('/latest', new Auth().m, async (ctx, next) => {
    const flow = await Flow.findOne({
        order: [
            ['index', 'DESC']
        ]
    })
    let art = await Art.getData(flow.art_id, flow.type);
    const likeLatest = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid);
    art.setDataValue('index', flow.index);
    art.setDataValue('like_status', likeLatest);
    ctx.body = art;
})

// 获取下一期
router.get('/:index/next', new Auth().m, async (ctx) => {
    const v = await new PositiveIntegerValidator().validate(ctx, {
        id: 'index'
    });
    const index = v.get('path.index');
    const flow = await Flow.findOne({
        where: {
            index:index + 1
        }
    });
    if(!flow) {
        throw new NotFound();
    }
    let art = await Art.getData(flow.art_id, flow.type);
    const likeNext = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid);
    art.setDataValue('index', flow.index);
    art.setDataValue('like_status', likeNext);
    // art.exclude = ['index','like_status']
    ctx.body = art;
})

// 获取上一期
router.get('/:index/previous', new Auth().m, async (ctx) => {
    const v = await new PositiveIntegerValidator().validate(ctx, {
        id: 'index'
    });
    const index = v.get('path.index');
    const flow = await Flow.findOne({
        where: {
            index:index - 1
        }
    });
    if(!flow) {
        throw new NotFound();
    }
    let art = await Art.getData(flow.art_id, flow.type);
    const likeNext = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid);
    art.setDataValue('index', flow.index);
    art.setDataValue('like_status', likeNext);
    ctx.body = art;
})

// 详情
router.get('/:type/:id', new Auth().m, async ctx => {
    const v = await new ClassicValidator().validate(ctx);
    const id = v.get('path.id');
    const type = parseInt(v.get('path.type'));
    const artDetail = await new Art(id, type).getDetail(ctx.auth.uid)
    artDetail.art.setDataValue('like_status', artDetail.like_status)
    ctx.body = artDetail.art;
})

// 获取点赞数
router.get('/:type/:id/favor', new Auth().m, async ctx => {
    const v = await new ClassicValidator().validate(ctx);
    const id = v.get('path.id');
    const type = parseInt(v.get('path.type'));
    const artDetail = await new Art(id, type).getDetail(ctx.auth.uid)
    ctx.body = {
        fav_nums: artDetail.art.fav_nums,
        like_status: artDetail.like_status
    }
})

router.get('/favor', new Auth().m, async ctx => {
    const uid = ctx.auth.uid;
    ctx.body = await Favor.getMyClassicFavors(uid);
})

module.exports = router;