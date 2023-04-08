const { execSync } = require('child_process')
const fs = require('hexo-fs')
const path = require('path')
const log = require('hexo-log')({
  debug: false,
  silent: false
})

const counts = (arr, value) => arr.reduce((a, v) => v === value ? a + 1 : a + 0, 0)

hexo.extend.helper.register('calendar', function (options) {
  return generateChart(options)
})

hexo.extend.tag.register('calendar', function (args, content) {
  return generateChart(JSON.parse(content))
}, { ends: true })

hexo.extend.console.register('gc', 'Generate calendar.json', function (args) {
  const date = new Date()
  const formatedDate = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0')
  const commitData = getCommitData(args.w)
  console.log(commitData)
  commitData[formatedDate] = commitData[formatedDate] ? (commitData[formatedDate] + 1) : 1
  const dataDir = path.join(this.source_dir, '_data')
  if (!fs.existsSync(dataDir)) {
    log.info('Creat dir ' + dataDir)
    fs.mkdirsSync(dataDir)
  }
  fs.writeFile(path.join(dataDir, 'calendar.json'), JSON.stringify(commitData), err => {
    if (err) {
      log.info('Failed to write data to calendar.json')
      console.error(err)
    } else {
      log.info('calendar.json has been saved')
    }
  })
})

function generateChart (options) {
  const defaultOptions = {
    width: '600',
    height: '165',
    id: 'calendar',
    monthLang: 'en',
    dayLang: 'en',
    weeks: 40,
    title: 'Calendar',
    insertScript: true,
    color: {
      "background": "#f9f9f9",
      "tooltip": {
        "background": "#555",
        "border": "#777"
      },
      "visualMap": {
        "inRange": '["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"]'
      },
      "calendar": {
        "name": "#3C4858",
        "itemBorder": "#fff",
        "monthLabel": "#3C4858",
        "dayLabel": "#3C4858"
      }
    }
  };

  const { width, height, id, monthLang, dayLang, weeks, title, insertScript, color } = Object.assign(defaultOptions, options)
  let commitData = '[]'
  if (fs.existsSync(path.join(hexo.source_dir, '_data/calendar.json'))) {
    commitData = fs.readFileSync(path.join(hexo.source_dir, '_data/calendar.json')).toString()
  } else {
    commitData = JSON.stringify(getCommitData(weeks))
  }
  return `
<div id="${id}_box" style="width:100%;overflow-x:auto;overflow-y:hidden;">
<div id="${id}" style="width: ${width}px;height:${height}px;"></div>
</div>
${insertScript ? '<script src="https://cdn.jsdelivr.net/npm/echarts@4.8.0/dist/echarts.min.js"></script>' : ''}
<script type="text/javascript">
  (function(){
    function dateFormat(date){
      date = new Date(date)
      return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0')
    }
    let calendarChart = echarts.init(document.getElementById('${id}'));
    let endDate = new Date().getTime()
    let startDate = new Date(endDate - ${weeks}*7*24*3600*1000).getTime()
    let startDay = Math.ceil(startDate/(24*3600*1000))
    let endDay = Math.ceil(endDate/(24*3600*1000))

    let commitData = ${commitData}
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
      backgroundColor: "${color.background}",
      tooltip: {
        padding: 10,
        backgroundColor: "${color.tooltip.background}",
        borderColor: "${color.tooltip.border}",
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
          color: ${color.visualMap.inRange}
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
            color: "${color.calendar.name}"
          }
        },
        itemStyle: {
          borderColor: "${color.calendar.itemBorder}",
          borderWidth: 2
        },
        yearLabel: {
          show: !1
        },
        monthLabel: {
          nameMap: ${typeof monthLang === 'string' ? `"${monthLang}"` : JSON.stringify(monthLang)},
          fontSize: 11,
          color: "${color.calendar.monthLabel}"
        },
        dayLabel: {
          formatter: "{start} 1st",
          nameMap: ${typeof dayLang === 'string' ? `"${dayLang}"` : JSON.stringify(dayLang)},
          fontSize: 11,
          color: "${color.calendar.dayLabel}"
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

    let box = document.getElementById("${id}_box")
    let child = document.getElementById("${id}")
    window.addEventListener('load',function(){
        box.scrollLeft = (child.clientWidth - box.clientWidth) / 2
    })

  })();
</script>
`
}
function getCommitData (weeks = '40') {
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
  return commitData
}
