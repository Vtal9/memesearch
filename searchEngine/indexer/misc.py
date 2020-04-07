# old_index_res - "{'url1', 'url2'}"
# new_index_res - {url3, url4}
# output - {url1, url2, url3, url4}
def union_descr(old_index_res, new_index_res):
	# str to set
	str_to_set = set()
	for url in old_index_res[1:-1].replace(',', '').replace('\'', '').split(' '):
		str_to_set.add(url)

	return str_to_set.union(new_index_res)

# old_index_res - "{'url1': [1], 'url2': [0, 1]}"
# new_index_res - {url3: [2], url4: [0, 2]}
# output - "{'url1': [1], 'url2': [0, 1], 'url3': [2], 'url4': [0, 2]}"
def union_text(old_index_res, new_index_res):
	return old_index_res.replace('}', ', ') + str(new_index_res).replace('{', '')
