#!/bin/sh
echo
if [ -a .commit ]
    then
    rm .commit
    git add build/*
    git add src/*
    git commit --amend --no-verify
fi
exit