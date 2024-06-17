<template>
  <div class="people-view">123</div>
</template>

<script>
export default {
  name: "PeopleView",
  data() {
    return {
      userId: this.$store.state.userId,
    };
  },
};
</script>

<style scoped>
.people-view{
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>