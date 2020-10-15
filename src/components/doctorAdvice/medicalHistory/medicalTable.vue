<template functional>
  <table
    align="center"
    class="medicalTable"
    border="1"
    width="97%"
    style="width:97%;  border-collapse: collapse;"
  >
    <tr bgcolor="#eee">
      <td
        valign="middle"
        style="padding:2px 5px;"
        v-for="item in props.column"
        :key="item.value"
      >
        <p align="center">
          <span>{{item.text}}</span>
        </p>
      </td>
    </tr>
    <tbody>
      <tr v-for="(item, index) in props.tableData" :key="index">
        <td valign="middle" style="padding:2px 5px;" v-for="el in props.column" :key="el.value">
          <p align="center">
            <span>{{item[el.value]?item[el.value]:'&nbsp;'}}</span>
          </p>
        </td>
      </tr>
    </tbody>
  </table>
</template>
 

