const { execSync } = require('child_process')

const counts = (arr, value) => arr.reduce((a, v) => v === value ? a + 1 : a + 0, 0)

hexo.extend.helper.register('calendar', function (options) {
  return generateChart(options)
})
hexo.extend.tag.register('calendar', function (args) {
  const options = {}
  for (const e of args) {
    let [key, value] = e.split('=')
    if (['monthLang', 'dayLang'].includes(key) && value.includes(',')) value = value.split(',')
    options[key] = value
  }
  return generateChart(options)
})
function generateChart (options) {
  const { width, height, id, monthLang, dayLang, weeks, title, insertScript } = Object.assign({ width: '600', height: '185', id: 'calendar', monthLang: 'en', dayLang: 'en', weeks: 40, title: 'Calendar', insertScript: true }, options)
  return `
<div id="${id}" style="width: ${width}px;height:${height}px;"></div>
  ${insertScript ? '<script src="https://cdn.jsdelivr.net/npm/echarts@4.8.0/dist/echarts.min.js"></script>' : ''}
  <script type="text/javascript">
    function dateFormat(date){
      date = new Date(date)
      return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0')
    }
    let calendarChart = echarts.init(document.getElementById('${id}'));
    let endDate = new Date().getTime()
    let startDate = new Date(endDate - ${weeks}*7*24*3600*1000).getTime()
    let startDay = Math.ceil(startDate/(24*3600*1000))
    let endDay = Math.ceil(endDate/(24*3600*1000))

    let commitData = ${getCommitData(weeks)}
    let seriesData = []

    for(let i = startDay;i <= endDay;i++){
      let date = i*24*3600*1000
      let formatDate = dateFormat(date)
      let times = commitData[formatDate] || 0
      seriesData.push([formatDate, times])
    }
    let option = {
      title: {
        text: "${title}",
        x: "center"
      },
      backgroundColor: "#f9f9f9",
      tooltip: {
        padding: 10,
        backgroundColor: "#555",
        borderColor: "#777",
        borderWidth: 1,
        formatter: function(a) {
          var b = a.value;
          return '<div style="font-size: 14px;">' + b[0] + "：" + b[1] + "</div>"
        }
      },
      visualMap: {
        show: !1,
        showLabel: !0,
        min: 0,
        max: 4,
        calculable: !1,
        inRange: {
          symbol: "rect",
          color: ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"]
        },
        itemWidth: 12,
        itemHeight: 12,
        orient: "horizontal",
        left: "center",
        top: 0
      },
      calendar: [{
        top: 50,
        left: "center",
        range: [dateFormat(startDate), dateFormat(endDate)],
        cellSize: [13, 13],
        splitLine: {
          show: !1
        },
        name: {
          textStyle: {
            color: "#3C4858"
          }
        },
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 2
        },
        yearLabel: {
          show: !1
        },
        monthLabel: {
          nameMap: ${typeof monthLang === 'string' ? `"${monthLang}"` : JSON.stringify(monthLang)},
          fontSize: 11,
          color: "#3C4858"
        },
        dayLabel: {
          formatter: "{start} 1st",
          nameMap: ${typeof dayLang === 'string' ? `"${dayLang}"` : JSON.stringify(dayLang)},
          fontSize: 11,
          color: "#3C4858"
        }
      }],
      series: [{
        type: "heatmap",
        coordinateSystem: "calendar",
        calendarIndex: 0,
        data: seriesData
      }]
    };

    calendarChart.setOption(option);
  </script>
`
}
function getCommitData (weeks) {
  const _cmd = `git log --since="${weeks}.weeks" --date=iso --pretty=format:"%ad"`
  const _gitLog = execSync(_cmd).toString()
  const gitlogData = _gitLog.split('\n').map(e => {
    return e.split(' ')[0]
  })
  const uniaueDate = [...new Set(gitlogData)]
  const commitData = {}
  for (const e of uniaueDate) {
    commitData[e] = counts(gitlogData, e)
  }
  return JSON.stringify(commitData)
}
