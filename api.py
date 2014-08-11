import requests
import json
import zerorpc


class ERPNextAPI(object):

	def __init__(self):
		self.session = requests.Session()


	def GET(self, erp, usr, pwd, action, params=None):
		if params != None:
			for key in params.keys():
				params[key] = json.dumps(params[key])

		self.login(erp, usr, pwd)
		res = self.session.get(erp + action, params=params)
		self.logout(erp)
		return res.json()


	def POST(self, erp, usr, pwd, action, data=None):
		if data != None:
			for key in data.keys():
				data[key] = json.dumps(data[key])

		self.login(erp, usr, pwd)
		res = self.session.post(erp + action, data=data)
		self.logout(erp)
		return res.json()


	def login(self, erp, usr, pwd):
		self.session.post(erp + "/api/method/login", data={"usr" : usr, "pwd" : pwd})


	def logout(self, erp):
		self.session.post(erp + "/api/method/logout")


print("ZeroRPC server started")
s = zerorpc.Server(ERPNextAPI())
s.bind("tcp://0.0.0.0:4242")
s.run()