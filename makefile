deploy:
	ansible-playbook deployment/prod.yaml -i localhost, --connection=local

install:
	# If the Ansible above fails, at least these are needed
	sudo apt install mongodb
	npm install
