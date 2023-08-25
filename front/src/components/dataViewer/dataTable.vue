<template>
  <div class="data-table-wrapper">
    <table class="tb-container">
      <thead>
        <tr>
          <th v-for="head in tableData.tHead" :key="tableData.tHead.indexOf(head)">
            <h1>{{ head }}</h1>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableData.tBody">
          <td v-for="cell in row">{{ cell }}</td>
          <!-- <td>{{ row.datD }}</td> -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";


const tableData = ref({
    'tHead': [
      '时间', 'X', 'Y', '流速'
    ],
    'tBody': [
        ['18:05:25', '578797.43', '3529961.32', '0.4'],
        ['18:05:49',	'578798.37','3529951.74',	'0.42' ]
    ]
})

</script>


<style lang='scss' scoped>
div.data-table-wrapper {
  // position: absolute;
  background-color: transparent;
  // left: 1vw;
  // top: 10vh;
  height: 100%;
  width: 100%;

  table.tb-container {
    overflow: hidden;
    width: 100%;
    // margin: -0.1em -0.3em -0.1em -0.1em;
    display: table;
    h1 {
      font-size: 0.8vw;
      line-height: 0.5em;
      text-align: center;
      color: rgba(255, 255, 255, 0.8);
    }
    td {
      font-weight: normal;
      font-size: 0.7vw;
      box-shadow: 0 2px 2px -2px #0e1119;
      width: 28%;
    }
    td:first-child {
      color: #b7dfff;
      font-weight: 600;
      width: 6%;
    }
    td:last-child {
      color: #aafff1;
      font-weight: 600;
      width: 16%;
    }
    td,
    th {
      padding-bottom: 1.2%;
      padding-top: 1.2%;
      padding-left: 0%;
      padding-right: 0%;
      text-align: center;
      color: rgba(255, 255, 255, 1);
    }
    th {
      padding-bottom: 0.5%;
      padding-top: 0.5%;
    }
    thead {
      tr:first-child {
        th:first-child {
          border-top-left-radius: 0.6em;
        }
        th:last-child {
          border-top-right-radius: 0.6em;
        }
      }
    }
    tr:nth-child(odd) {
      background-color: rgba(5, 28, 56, 0.9);
    }
    tr:nth-child(even) {
      background-color: rgba(9, 30, 80, 0.9);
    }
    tr:last-child {
      td:first-child {
        border-bottom-left-radius: 0.6em;
      }
      td:last-child {
        border-bottom-right-radius: 0.6em;
      }
    }
    th {
      background-color: rgba(0, 41, 155, 0.8);
    }
    tr:hover {
      background-color: rgba(10, 76, 255, 0.8);
      box-shadow: 0 4px 4px -4px #0e1119;
    }
    td:hover {
      cursor: pointer;
      background-color: #42aaff;
      color: #dceaff;
      font-weight: bold;
      box-shadow: #21427f -1px 1px, #21427f -2px 2px, #21427f -3px 3px,
        #21427f -4px 4px, #21427f -5px 5px, #21427f -6px 6px;
      transform: translate3d(3px, -3px, 0);
      transition-delay: 0s;
      transition-duration: 0.4s;
      transition-property: all;
      transition-timing-function: line;
    }
  }
}
</style>