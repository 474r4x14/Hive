export default class Utils {
    static populateItem(item, data)
    {
        for (var key in data) {
            if (item[key] !== undefined) {
                item[key] = data[key];
            }
        }
    }

    static dist(x1,y1,x2,y2)
    {
        var dx,dy,dist;
        dx = x2 - x1;
        dy = y2 - y1;
        dist = Math.sqrt(dx*dx + dy*dy);
        return dist;
    }
}
