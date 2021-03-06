<template>
  <div id="good-pre-page">
    <header-nav title="商品详情" />
    <van-swipe :autoplay="3000">
      <van-swipe-item v-for="(image, index) in images" :key="index" class="good-pic-box">
        <img v-lazy="image" class="good-pic" />
      </van-swipe-item>
    </van-swipe>
    <div class="good-info-box">
      <div class="good-info">
        <div class="name">{{ name }}</div>
        <!-- <div class="hot">热度：{{ hot }}</div> -->
      </div>
      <p class="good-desc">{{ desc }}</p>
      <p class="good-price">¥ {{ price }}</p>
      <van-tag v-for="(tag, i) in tags" :key="i" mark type="danger" class="good-tag">{{ tag }}</van-tag>
    </div>
    <div class="recommend-good-list">
      <div class="recommend-title">产品详情图片</div>
      <div class="special-product-detail" v-html="details"></div>
      <!-- <div class="recommend-goods">
        <img v-for="(image, i) in details" :key="i" :src="image" class="recommend-image">
      </div> -->
    </div>
    <van-goods-action>
      <van-goods-action-big-btn @click="handleBuyClick" text="立即下单" primary />
    </van-goods-action>
    <van-actionsheet v-model="showPanel" title="填写订单信息" class="buy-panel">
      <div class="buy-form">
        <van-card :thumb="thumb" class="buy-good-info">
          <div slot="title" class="buy-good-info-price">¥ {{ price }}</div>
          <div slot="desc">{{ name }}</div>
        </van-card>
        <van-cell title="购买数量：">
          <van-stepper v-model="buyCount" />
        </van-cell>
        <van-cell title="订单金额：" :value="totalPrice" />
        <van-field v-model="consignee" label="联系人：" placeholder="请输入联系人" />
        <van-field v-model="mobile" label="手机：" placeholder="请输入联系电话" />
        <van-field v-model="address" label="地址：" placeholder="请输入收货地址" />
        <van-button size="large" type="danger" @click="submit" class="submit-btn">立即支付</van-button>
      </div>
    </van-actionsheet>
  </div>
</template>

<script>
import {
  Swipe,
  SwipeItem,
  Tag,
  GoodsAction,
  GoodsActionBigBtn,
  Actionsheet,
  Cell,
  Card,
  Stepper,
  Button,
  Toast,
  Field
} from 'vant'
import HeaderNav from '@/components/HeaderNav'
import api from '@/api'
const { product } = api

export default {
  components: {
    HeaderNav,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Tag.name]: Tag,
    [GoodsAction.name]: GoodsAction,
    [GoodsActionBigBtn.name]: GoodsActionBigBtn,
    [Actionsheet.name]: Actionsheet,
    [Cell.name]: Cell,
    [Card.name]: Card,
    [Stepper.name]: Stepper,
    [Button.name]: Button,
    [Toast.name]: Toast,
    [Field.name]: Field
  },

  data() {
    return {
      id: 0,
      name: '',
      hot: '',
      price: '',
      desc: '',
      tags: [],
      thumb: '',
      images: [],
      details: '',
      showPanel: false,
      buyCount: 1,
      consignee: '',
      mobile: '',
      address: ''
    }
  },

  computed: {
    totalPrice() {
      let price = Number(this.price)
      return price * this.buyCount
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$bus.$emit('hide-footer')
      vm.id = vm.$route.params.id
    })
  },

  async mounted() {
    const res = await product.getShopProductDetail({ id: this.$route.params.id })
    if (res.code !== 0) return
    const data = res.data
    this.id = data.id
    this.name = data.product_name
    this.price = data.price
    this.desc = data.description
    this.tags = data.tags
    this.thumb = data.index_pic
    this.images = data.pic
    this.details = data.detail || ''
  },

  beforeRouteLeave(to, from, next) {
    const footerActiveIndex = to.path === '/home' ? 0 : 1
    this.$bus.$emit('show-footer', footerActiveIndex)
    next()
  },
  
  methods: {
    handleBuyClick() {
      this.showPanel = true
    },
    submit() {
      if (!this.State.isLogin) {
        this.$router.replace('/login')
        return
      }
      if (!this.consignee || !this.mobile || !this.address) {
        Toast.fail({
          duration: 1500,
          message: '请填写完整的收货信息'
        })
        return
      } else if (!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(this.mobile)) {
        Toast.fail({
          duration: 1500,
          message: '手机号格式不正确'
        })
        return
      }
      product.orderShopProduct({
        product_id: this.id,
        goods_number: this.buyCount,
        mobile: this.mobile,
        consignee: this.consignee,
        address: this.address
      }).then(res => {
        if (res.code === -1) {
          Toast.fail(res.message)
          return
        }
        this.$router.push({
          path: '/pay',
          query: {
            sn: res.order.order_sn,
            price: res.order.order_price,
            number: res.order.goods_number
          }
        })
      })
    },
  }
}
</script>

<style scoped>
#good-pre-page {
  margin-bottom: 50px;
}
.good-pic-box {
  background: #fff;
}
.good-pic {
  width: 100%;
  height: 240px;
}
.good-info-box {
  margin-bottom: 10px;
  padding: 15px;
  background: #fff;
  box-shadow: 3px 3px 3px #ccc;
  font-size: 16px;
}
.good-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}
.good-desc {
  margin: 10px 0;
  font-size: 14px;
}
.good-price {
  margin: 10px 0;
  font-size: 22px;
  font-weight: bold;
}
.good-tag {
  margin-right: 5px;
  margin-bottom: 10px;
  font-size: 14px;
}
.recommend-good-list {
  padding: 15px;
  background: #fff;
  font-size: 16px;
}
.recommend-title {
  margin-bottom: 10px;
  font-weight: 600;
}
.special-product-detail {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}
.recommend-image {
  width: 48%;
  height: 150px;
  margin-bottom: 10px;
}
.buy-panel {
  font-size: 16px;
}
.buy-form {
  padding: 20px;
}
.buy-good-info {
  background-color: #fff;
}
.buy-good-info-price {
  margin-top: 20px;
}
</style>
