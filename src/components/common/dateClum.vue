<template>
<div>
  <el-select v-model="yearvalue" placeholder="年">
    <el-option
      v-for="item in year"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>

  <el-select v-model="monthvalue" placeholder="月">
    <el-option
      v-for="item in month"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        year: [{
          value: '0',
          label: '2018'
        }, {
          value: '1',
          label: '2019'
        }, {
          value: '2',
          label: '2020'
        }, {
          value: '3',
          label: '2021'
        }, {
          value: '4',
          label: '2022'
        },
        {
          value: '5',
          label: '2023'
        },
        {
          value: '6',
          label: '2024'
        },
        {
          value: '7',
          label: '2025'
        },
        {
          value: '8',
          label: '2026'
        },
        {
          value: '9',
          label: '2027'
        },],
        yearvalue: '',
       month: [{
          value: '1',
          label: '1'
        }, {
          value: '2',
          label: '2'
        }, {
          value: '3',
          label: '3'
        }, {
          value: '4',
          label: '4'
        }, {
          value: '5',
          label: '5'
        },
        {
          value: '6',
          label: '6'
        },
        {
          value: '7',
          label: '7'
        },
        {
          value: '8',
          label: '8'
        },
        {
          value: '9',
          label: '9'
        },
        {
          value: '10',
          label: '10'
        },
        {
          value: '11',
          label: '11'
        },
        {
          value: '12',
          label: '12'
        },
        ],
         monthvalue: '',
      }

    },
    watch: {
        monthvalue: function () {
             
            this.$global.dateColumn().monthvalue = this.month[this.monthvalue-1].label
            console.log("watch on monthvalue:"+this.$global.dateColumn().monthvalue)
           
        },
        yearvalue:function()
        {
            
            this.$global.dateColumn().yearvalue = this.year[this.yearvalue].label
            console.log("watch on yearvalue"+this.$global.dateColumn().yearvalue)
        }
    }
  }
</script>