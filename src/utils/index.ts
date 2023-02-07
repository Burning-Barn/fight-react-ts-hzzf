import axios, {AxiosResponse} from 'axios'

const getCurrentCityInfo = async (currentCity: string) => {
        // localStorage.setItem("hkzf_currentCity", JSON.stringify({
        //     label: '杭州',
        //     value: 'hangzhou'
        // }))
        let _currentCity = JSON.parse(localStorage.getItem('hkzf_currentCity'))
        if(_currentCity) {
            return Promise.resolve(_currentCity)
        }
        return new Promise((resolve, reject) => {
             AMap.plugin('AMap.CitySearch', function () {
                var citySearch = new AMap.CitySearch()
                 citySearch.getLocalCity(async function (status, result) {
                  if (status === 'complete' && result.info === 'OK') {
                    // 查询成功，result即为当前所在城市信息
                    // console.log('status', status)
                    if(result.city) {
                        try {
                            const resCity:AxiosResponse<any> = await axios.get(`http://localhost:8085/area/info`, {params: {name: result.city}})
                            // console.log('resCity', resCity)
                            const {
                                data: {
                                    body: _resCurrentCity
                                }
                            } = resCity
                            localStorage.setItem('hkzf_currentCity', JSON.stringify(_resCurrentCity))
                            resolve(_resCurrentCity)
                        } catch (error) {
                            reject(error)  
                        }
                    }
                  }
                })
              })
        })

}

export { getCurrentCityInfo }