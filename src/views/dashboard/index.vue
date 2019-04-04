<template>
  <div class="dashboard-container">
    <div class="pro-indroduction">
       Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    </div>
    <div class="resouse-container">
      <div class="base-item area-wrapper">

      </div>
      <div class="base-item checkline-wrapper">

      </div>
      <div class="base-item od-wrapper">

      </div>
      <div class="base-item livejob-wrapper">

      </div>
    </div>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="scss" scoped>
.pro-indroduction{
  text-indent: 40px;
}
.resouse-container{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap:wrap;
  .base-item{
    width: 48%;
    min-width: 500px;
    height: 220px;
    border: 1px solid #2a5eb0;
    &:nth-child(1), &:nth-child(2){
      margin-bottom: 10px;
    }
  }
}
</style>
