let Util = {}
Util.authRoutes = function (menus) {
  let asycRoutesArr = []
  menus.forEach(menu => {
    const tmp = { ...menu }
    if (tmp.name) {
      if (tmp.children) {
        let tmpArr = Util.authRoutes(tmp.children)
        asycRoutesArr = asycRoutesArr.concat(tmpArr)
      }
      asycRoutesArr.push(tmp.name)
    }
  })
  return asycRoutesArr
}
export default Util