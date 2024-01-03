SHELL = bash

.PHONY: server
server:
	hugo server -t $(TEMPLATE)

.PHONY: new-with-date
new-with-date:
	@echo 'It will generate `content/'$(shell date +%Y/%m/%d)'/$${slug}.md`'
	@echo
	@read -p "Enter article's slug: " slug; \
		hugo new $(shell date +%Y/%m/%d)/$$slug.md

.PHONY: new
new:
	@echo 'It will generate `content/$${slug}.md`'
	@echo
	@read -p "Enter article's slug: " slug; \
		hugo new $$slug.md