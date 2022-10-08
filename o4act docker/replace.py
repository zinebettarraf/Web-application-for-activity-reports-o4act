#!/usr/bin/env python3
# coding: utf-8

import os
import sys

def staticify(l, tag, prop):
	if l.find("static_url") >= 0:
		return l
	
	s = l
	if l.find('<{}'.format(tag)) >= 0: # modifie les lignes link
		txt = '{}="'.format(prop)
		idx = l.find(txt)
		if idx >= 0:
			s = l[:idx + len(txt)] + "{{static_url('." + l[idx + len(txt):]
			txt = '">'
			idx = s.find(txt)
			if idx >= 0:
				s = s[:idx] + "')}}" + s[idx:]
	return s

# lecture du fichier
lines = []
with open(sys.argv[1]) as f:
	lines = f.readlines()

# ecriture du fichier modifié avec static_url
with open(sys.argv[1], "w") as f:
	for l in lines:
		if l.find("manifest") >=0 :
			continue
		nl = staticify(l=l, tag="link", prop="href")
		nl = staticify(l=nl, tag="script", prop="src")
		f.write(nl)

