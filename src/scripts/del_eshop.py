import sys
import redis
import MySQLdb

def delEshopUser(uid):
    try:
        conn = MySQLdb.connect(host='localhost',user='deposit',passwd='Deposit@00',db='db_eshop',port=3306)
        cur=conn.cursor()
        cur.execute('SET NAMES UTF8')
        cur.execute("delete from ecs_booking_goods where user_id = %d" %uid)
        cur.execute("delete from ecs_collect_goods where user_id = %d" %uid)
        cur.execute("delete from ecs_feedback where user_id = %d" %uid)
        cur.execute("delete from ecs_user_address where user_id = %d" %uid)
        cur.execute("delete from ecs_user_bonus where user_id = %d" %uid)
        cur.execute("delete from ecs_user_account where user_id = %d" %uid)
        cur.execute("delete from ecs_tag where user_id = %d" %uid)
        cur.execute("delete from ecs_account_log where user_id = %d" %uid)
        cur.execute("delete from ecs_sns where user_id = %d" %uid)
        cur.execute("delete from ecs_users where user_id = %d" %uid)
        cur.close()
        conn.close()
    except MySQLdb.Error,e:
        print "Mysql Error %d: %s\n" %(e.args[0],e.args[1])

def getAllUsers():
    try:
        parents = {}
        conn = MySQLdb.connect(host='localhost',user='deposit',passwd='Deposit@00',db='db_eshop',port=3306)
        cur=conn.cursor()
        cur.execute('SET NAMES UTF8')
        cur.execute('select user_id,user_name,email from ecs_users order by user_name')
        res = cur.fetchall()
        for row in res:
            print "eshop user: %d -> %s, %s" %(row[0],row[1],row[2])
            parents[row[1]] = row[0]

        cur.close()
        conn.close()
        return parents
    except MySQLdb.Error,e:
        print "Mysql Error %d: %s\n" %(e.args[0],e.args[1])


if __name__ == "__main__":
    print "delete eshop user by username"
    print "usage\t<username1> <username2> ..."
    users = getAllUsers()
    if len(sys.argv) < 2:
        sys.exit(0)
    for i in range(1, len(sys.argv)):
        if users.has_key(sys.argv[i]) :
            delEshopUser(users[sys.argv[i]])
    print "done"
